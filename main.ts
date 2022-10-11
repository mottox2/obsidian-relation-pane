import { Plugin } from 'obsidian';
import { RelationView } from "./src/RelationView"

const VIEW_TYPE = 'relation-view';

export default class MyPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'open-sample-panel',
			name: 'Open relation panel',
			callback: () => {
				this.activateView();
			}
		});

		this.registerView(VIEW_TYPE, (leaf) => {
			return new RelationView(leaf)
		})

		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (
			evt: MouseEvent) => {
			this.activateView()
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');
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
