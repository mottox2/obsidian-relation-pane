import { h } from 'dom-chef';
import { ItemView, MarkdownView } from 'obsidian';

const getBackLinks = (resolvedLinks: Record<string, Record<string, number>>, filePath: string, ignorePath: string) => {
  const backLinks = []
  for (const src of Object.keys(resolvedLinks)) {
    const links = resolvedLinks[src]
    for (const dest of Object.keys(links)) {
      if (dest === filePath && src !== ignorePath) {
        console.log({ dest, src, ignorePath })
        backLinks.push(src)
      }
    }
  }
  return backLinks
}

const LinkIcon = () => {
  return <svg viewBox="0 0 100 100" width="16" height="16"><path fill="currentColor" stroke="currentColor" d="M73.3,6.7C68,6.7,63,8.7,59.2,12.5l-6.7,6.7c-3.8,3.8-5.9,8.8-5.9,14.1c0,4.2,1.3,8.2,3.7,11.6l-5.5,5.5 c-3.4-2.4-7.4-3.7-11.6-3.7c-5.3,0-10.4,2.1-14.1,5.9l-6.7,6.7C8.7,63,6.7,68,6.7,73.3c0,5.3,2.1,10.4,5.9,14.1s8.8,5.9,14.1,5.9 c5.3,0,10.4-2.1,14.1-5.9l6.7-6.7c3.8-3.8,5.9-8.8,5.9-14.1c0-1.8-0.3-3.6-0.7-5.4l-6,6c-0.2,3.2-1.4,6.3-3.8,8.8l-6.7,6.7 c-5.2,5.2-13.7,5.2-18.9,0c-5.2-5.2-5.2-13.7,0-18.9l6.7-6.7c2.6-2.6,6-3.9,9.4-3.9c2.3,0,4.7,0.7,6.7,1.9L31,64.3 c-0.9,0.8-1.2,2.1-0.9,3.2c0.3,1.2,1.2,2.1,2.4,2.4c1.2,0.3,2.4,0,3.2-0.9L69,35.7c1-1,1.3-2.4,0.7-3.7c-0.5-1.3-1.8-2.1-3.2-2 c-0.9,0-1.7,0.4-2.3,1l-9.1,9.1c-3-5.1-2.4-11.8,2-16.2l6.7-6.7c2.6-2.6,6-3.9,9.4-3.9c3.4,0,6.8,1.3,9.4,3.9 c5.2,5.2,5.2,13.7,0,18.9l-6.7,6.7c-2.4,2.4-5.6,3.7-8.8,3.8l-6,6c1.7,0.5,3.5,0.7,5.4,0.7c5.3,0,10.4-2.1,14.1-5.9l6.7-6.7 c3.8-3.8,5.9-8.8,5.9-14.1c0-5.3-2.1-10.4-5.9-14.1C83.7,8.7,78.7,6.7,73.3,6.7z"></path></svg>
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
      console.log(page, getBackLinks(resolvedLinks, page, file.path))
      twoHopLinks[page] = getBackLinks(resolvedLinks, page, file.path)
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
      <h3><LinkIcon /> Links</h3>
      {
        backLinks && backLinks.map(link => {
          return <p className='relationLink' onClick={() => {
            openLink(link)
          }}>{link}</p>
        })
      }
      {
        twoHopLinks && Object.keys(twoHopLinks).map(file => {
          const links = twoHopLinks[file]
          if (links.length === 0) return
          return <div>
            <h3><LinkIcon /> {file.replace(/.md$/, '')}</h3>
            {links.map(link => {
              return <p className='relationLink' onClick={() => {
                openLink(link)
              }}>{link}</p>
            })}
          </div>
        })
      }
      {false && <div>
        <h3>Debugger</h3>
        <p>resolvedLinks</p>
        <pre>{JSON.stringify(this.app.metadataCache.resolvedLinks, null, 2)}</pre>
        <p>unresolvedLinks</p>
        <pre>{JSON.stringify(this.app.metadataCache.unresolvedLinks, null, 2)}</pre>
      </div>}
    </div>
    container.appendChild(view);
  }
}