import { PluginSettingTab, App, Setting } from "obsidian";
import type RelationPanePlugin from "./main"

export interface Settings {
  experimentalHideFolderPath: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  experimentalHideFolderPath: false
}

export class SettingTab extends PluginSettingTab {
  plugin: RelationPanePlugin;

  constructor(app: App, plugin: RelationPanePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h3', { text: 'Advanced' });

    new Setting(containerEl)
      .setName("Hide folder name")
      .setDesc("it shows file name only instead of full path.")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.experimentalHideFolderPath)
          .onChange(async (value) => {
            await this.plugin.updateSettings({
              experimentalHideFolderPath: value
            });
          });
      })
  }
}