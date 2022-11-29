import { ItemView, Keymap } from "obsidian"
import Pane from "./ui/Pane.svelte";
import store from "./store"

export const VIEW_TYPE = "relation-view"

const getBackLinks = (
  resolvedLinks: Record<string, Record<string, number>>,
  filePath: string,
  ignorePath?: string
) => {
  const backLinks = []
  for (const src of Object.keys(resolvedLinks)) {
    const links = resolvedLinks[src]
    for (const dest of Object.keys(links)) {
      if (dest === filePath && src !== ignorePath) {
        backLinks.push(src)
      }
    }
  }
  return backLinks
}

export class RelationView extends ItemView {
  component: Pane

  constructor(leaf: any) {
    super(leaf)
    this.collect = this.collect.bind(this)
  }
  getViewType(): string {
    return VIEW_TYPE
  }
  getDisplayText(): string {
    return "Relation View"
  }
  getIcon(): string {
    return "link"
  }
  async onOpen() {
    this.component = new Pane({
      target: this.contentEl,
      props: {
        openLink: (e: MouseEvent, link: string) => {
          const file = this.app.workspace.getActiveFile()
          if (!file) return
          this.app.workspace.openLinkText(link, file.path, Keymap.isModEvent(e))
        }
      }
    });
    this.collect();
    this.app.workspace.on("file-open", this.collect)
    this.app.metadataCache.on("resolved", this.collect)
  }
  async onClose() {
    this.component.$destroy();
    this.app.workspace.off("file-open", this.collect)
    this.app.metadataCache.off("resolved", this.collect)
  }
  private collect() {
    const file = this.app.workspace.getActiveFile()
    if (!file) {
      store.set({
        noActiveFile: true,
        links: [],
        newLinks: [],
        backLinks: [],
      })
      return
    }

    const resolvedLinks = this.app.metadataCache.resolvedLinks
    const links = Object.keys(resolvedLinks[file.path] || {})

    const unresolvedLinks = this.app.metadataCache.unresolvedLinks
    const newLinks = Object.keys(unresolvedLinks[file.path] || {})
    const backLinks = getBackLinks(resolvedLinks, file.path)

    // getFrontLinks
    let frontLinks: string[] = Object.keys(resolvedLinks[file.path]) || []
    let frontUnresolvedLinks: string[] =
      Object.keys(unresolvedLinks[file.path]) || []

    let twoHopLinks: Record<string, string[]> = {}
    // get second degree links
    for (let page of frontLinks) {
      twoHopLinks[page] = getBackLinks(resolvedLinks, page, file.path)
    }
    for (let page of frontUnresolvedLinks) {
      twoHopLinks[page] = getBackLinks(unresolvedLinks, page, file.path)
    }

    store.set({
      noActiveFile: false,
      links,
      newLinks,
      backLinks,
    })
  }
}
