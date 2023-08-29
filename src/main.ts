import {
  WorkspaceLeaf,
  ItemView,
  App,
  Editor,
  type MarkdownFileInfo,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  type PluginManifest,
} from "obsidian";
import Component from "./list.svelte";

interface Settings {
  setting: string;
}

const DEFAULT_SETTINGS: Settings = {
  setting: "default",
};

export default class Arbiter extends Plugin {
  settings: Settings;
  view: ExampleView | null;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
    this.view = null;
  }

  override async onload() {
    console.log("!!!! onload() !!!!");
    await this.loadSettings();

    this.registerView("svelte-view", (leaf: WorkspaceLeaf) => {
      return (this.view = new ExampleView(leaf));
    });

    // Create icon in the left ribbon
    this.addRibbonIcon(
      "list-checks",
      "Task List",
      (_evt: MouseEvent) => {
        new Notice("Task list");
      },
    );

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("Status Bar Text");

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "open_task_list",
      name: "Open task list",
      callback: () => {
        new SampleModal(this.app).open();
      },
    });

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: "sample-editor-command",
      name: "Sample editor command",
      editorCallback: (
        editor: Editor,
        _ctx: MarkdownView | MarkdownFileInfo,
      ) => {
        console.log(editor.getSelection());
        editor.replaceSelection("Sample Editor Command");
      },
    });
    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: "open-sample-modal-complex",
      name: "Open sample modal (complex)",
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
        return false;
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
    );
  }

  override onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  override onOpen() {
    const { contentEl } = this;
    contentEl.setText("Woah!");
  }

  override onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: Arbiter;

  constructor(app: App, plugin: Arbiter) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.setting)
          .onChange(async (value) => {
            this.plugin.settings.setting = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
  component: Component;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.component = new Component({
      target: this.contentEl,
      props: {
        variable: 1,
      },
    });
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Example view";
  }

  override async onOpen() {
    this.component = new Component({
      target: this.contentEl,
      props: {
        variable: 1,
      },
    });
  }

  override async onClose() {
    this.component.$destroy();
  }
}
