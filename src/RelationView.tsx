import { h } from 'dom-chef';
import { ItemView, MarkdownView } from 'obsidian';

const getBackLinks = (resolvedLinks: Record<string, Record<string, number>>, filePath: string) => {
  const backLinks = []
  for (const src of Object.keys(resolvedLinks)) {
    const links = resolvedLinks[src]
    for (const link of Object.keys(links)) {
      if (link === filePath) {
        backLinks.push(src)
      }
    }
  }
  return backLinks
}

export class RelationView extends ItemView {
  constructor(leaf: any) {
    super(leaf);
    this.render = this.render.bind(this)
  }
  getViewType(): string {
    return "relation-view"
  }
  getDisplayText(): string {
    return "Relation View"
  }
  async onOpen() {
    this.render()
    this.app.workspace.on('file-open', this.render)
  }

  async onClose() {
    this.app.workspace.off('file-open', this.render)
  }

  private render() {
    console.log('render')
    const container = this.containerEl.children[1];
    container.empty();

    const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
    if (!markdownView) return
    const file = markdownView.file
    const fileCache = this.app.metadataCache.getFileCache(file)
    const links = fileCache?.links

    // getBackLinks
    const resolvedLinks = this.app.metadataCache.resolvedLinks
    const backLinks = []
    for (const src of Object.keys(resolvedLinks)) {
      const links = resolvedLinks[src]
      for (const link of Object.keys(links)) {
        if (link === file.path) {
          backLinks.push(src)
        }
      }
    }

    // getFrontLinks
    let frontLinks: string[] = []
    if (resolvedLinks[file.path])
      frontLinks = Object.keys(resolvedLinks[file.path])

    let twoHopLinks: Record<string, string[]> = {}
    // get backLinks of fontLinks
    for (let page of frontLinks) {
      console.log(page, getBackLinks(resolvedLinks, page))
      twoHopLinks[page] = getBackLinks(resolvedLinks, page)
      // TODO: backlinksからこのページ自体を削除する
      // その結果、中身のないリストができるので、それを削除する
    }

    const openLink = (link: string) => {
      this.app.workspace.openLinkText(link, file.path)
    }

    const view = <div>
      {/* <h3>Links</h3>
      {
        links && links.map(link => {
          return <p>{JSON.stringify(link, null, 2)}</p>
        })
      } */}
      <h3>BackLinks</h3>
      {
        backLinks && backLinks.map(link => {
          return <p onClick={() => {
            openLink(link)
          }}>{link}</p>
        })
      }
      <h3>TwoHopLinks</h3>
      {
        twoHopLinks && Object.keys(twoHopLinks).map(file => {
          const links = twoHopLinks[file]
          return <div>
            <h4>{file.replace(/.md$/, '')}</h4>
            {links.map(link => {
              return <p onClick={() => {
                openLink(link)
              }}>{link}</p>
            })}
          </div>
        })
      }
      <h3>Debugger</h3>
      <p>resolvedLinks</p>
      <pre>{JSON.stringify(this.app.metadataCache.resolvedLinks, null, 2)}</pre>
      <p>unresolvedLinks</p>
      <pre>{JSON.stringify(this.app.metadataCache.unresolvedLinks, null, 2)}</pre>
    </div>
    container.appendChild(view);
  }
}