import {
  WorkspaceLeaf,
  ItemView,
  App,
  Plugin,
  type PluginManifest,
} from "obsidian";
import { getDefaultLogger, type Logger } from "./logging_service.js";
import TextFileService from "./text_file_service.js";
import TaskListComponent from "./List.svelte";
import TasksApplication from "./tasks_application.js";
import { tasks } from "./store.js";

export default class Arbiter extends Plugin {
  #logger: Logger;
  tasksApplication: TasksApplication;
  textFileService: TextFileService;
  view: TaskListView | null;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.#logger = getDefaultLogger();
    this.textFileService = new TextFileService(this.#logger, this.app.vault);
    this.tasksApplication = new TasksApplication(this.#logger);
    this.view = null;
  }

  override async onload() {
    this.#logger.debug("onload()");

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

    this.tasksApplication.registerSubscriber((task: string) => {
      tasks.update((t) => [...t, task]);
    });

    this.tasksApplication.sync(this.textFileService);
  }

  override onunload() {
    this.#logger.debug("onunload()");
  }

  async activateView() {
    this.#logger.debug("activateView()");

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
  #logger: Logger;
  component: TaskListComponent;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.#logger = getDefaultLogger();
    this.component = new TaskListComponent({
      target: this.contentEl,
      props: {},
    });
  }

  getViewType() {
    // Can't use logger here because it hasn't been initialized yet
    // this.#logger.debug("getViewType()");

    return TASK_LIST_VIEW;
  }

  getDisplayText() {
    // Can't use logger here because it hasn't been initialized yet
    // this.#logger.debug("getDisplayText()");

    return "Task List";
  }

  override async onOpen() {
    this.#logger.debug("onOpen()");
  }

  override async onClose() {
    this.#logger.debug("onClose()");
    this.component.$destroy();
  }
}
