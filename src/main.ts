import { Plugin } from "obsidian"
import { RelationView, VIEW_TYPE } from "./view"
import { SettingTab, DEFAULT_SETTINGS } from './settings'
import type { Settings } from './settings'

export default class RelationPanePlugin extends Plugin {
  private _settings: Settings

  get settings() {
    return this._settings
  }

  get activeView() {
    return this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]?.view as RelationView;
  }

  async onload() {
    this.addCommand({
      id: "open-relation-panel",
      name: "Open relation view",
      checkCallback: (checking) => {
        if (checking) {
          return this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0
        }
        this.activateView()
      },
    })

    this.registerView(VIEW_TYPE, (leaf) => {
      return new RelationView(leaf, this)
    })

    await this.loadSettings()
    this.addSettingTab(new SettingTab(this.app, this))

    if (this.app.workspace.layoutReady) {
      this.activateView()
    }
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE)
  }

  async loadSettings() {
    this._settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async updateSettings(newSettings: Partial<Settings>) {
    this._settings = Object.assign({}, this._settings, newSettings);
    await this.saveData(this._settings);
    this.activeView?.refresh();
  }

  // https://marcus.se.net/obsidian-plugin-docs/user-interface/views
  private async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE)
    const workspaceLeaf = this.app.workspace.getRightLeaf(false)
    await workspaceLeaf.setViewState({
      type: VIEW_TYPE,
      active: true,
    })
    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
    )
  }
}
