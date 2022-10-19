import { Plugin } from 'obsidian';
import { RelationView } from "./src/RelationView"

const VIEW_TYPE = 'relation-view';

export default class MyPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'open-relation-panel',
			name: 'Open relation view',
			checkCallback: (checking) => {
				if (checking) {
					return this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0;
				}
				this.activateView();
			}
		});

		this.registerView(VIEW_TYPE, (leaf) => {
			return new RelationView(leaf)
		})

		if (this.app.workspace.layoutReady) {
			this.activateView();
		}
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	// https://marcus.se.net/obsidian-plugin-docs/user-interface/views
	private async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
		const workspaceLeaf = this.app.workspace.getRightLeaf(false)
		await workspaceLeaf.setViewState({
			type: VIEW_TYPE,
			active: true
		});
		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}
}
