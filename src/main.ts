import {
  WorkspaceLeaf,
  ItemView,
  App,
  Plugin,
  type PluginManifest,
} from "obsidian";
import TextFileService from "./text_file_service.js";
import TaskListComponent from "./List.svelte";

export default class Arbiter extends Plugin {
  view: TaskListView | null;
  textFileService: TextFileService;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.view = null;
    this.textFileService = new TextFileService(this.app.vault);
  }

  override async onload() {
    this.registerView(TASK_LIST_VIEW, (leaf: WorkspaceLeaf) => {
      return (this.view = new TaskListView(leaf));
    });

    this.addRibbonIcon("list-checks", "Task List", (_evt: MouseEvent) => {
      this.activateView();
    });

    this.addCommand({
      id: "open_task_list",
      name: "Open task list",
      callback: () => {
        this.activateView();
      },
    });

    // Markdown tasks
    console.log(await this.textFileService.searchAllFiles(/^[ \t]*\- ?\[[ |x]?\][ \t].*$/gmi));
    // Bracket tasks
    console.log(await this.textFileService.searchAllFiles(/^[ \t]*\[[ |x]?\][ \t].*$/gmi));
    // Numerated tasks
    console.log(
      await this.textFileService.searchAllFiles(/^[ \t]*[0-9]+\.[ \t]?\[[ |x]?\][ \t].*$/gmi),
    );
    // TODO tasks
    console.log(
      await this.textFileService.searchAllFiles(/^[ \t]*todo:?[ \t].*$/gmi),
    );
    // TASK tasks
    console.log(
      await this.textFileService.searchAllFiles(/^[ \t]*task:?[ \t].*$/gmi),
    );
  }

  override onunload() {}

  async activateView() {
    const views = this.app.workspace.getLeavesOfType(TASK_LIST_VIEW);

    if (views.length) {
      return;
    }

    await this.app.workspace.getLeaf(true).setViewState({
      type: TASK_LIST_VIEW,
      active: true,
    });
  }
}

export const TASK_LIST_VIEW = "task_list_view";

export class TaskListView extends ItemView {
  component: TaskListComponent;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.component = new TaskListComponent({
      target: this.contentEl,
      props: {},
    });
  }

  getViewType() {
    return TASK_LIST_VIEW;
  }

  getDisplayText() {
    return "Task List";
  }

  override async onOpen() {}

  override async onClose() {
    this.component.$destroy();
  }
}
