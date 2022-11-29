<script lang="ts">
  import { connections } from "src/store"
  import LinkIcon from "./LinkIcon.svelte"
  import NewLinkIcon from "./NewLinkIcon.svelte"

  export let openLink = (event: MouseEvent, link: string) => {}
  let connectedNotes = {
    noActiveFile: true,
    links: [],
    backLinks: [],
    newLinks: [],
  }

  connections.subscribe((value) => {
    if (Object.keys(value).length === 0) return
    connectedNotes = value
  })

  const extractExt = (name: string) => {
  return name.replace(/.md$/, "")
}
</script>

<div class="backlink-pane">
  {#if connectedNotes.noActiveFile}
    <div class="pane-empty">No active file.</div>
  {:else}
    <div class="tree-item-self">
      <div class="tree-item-inner">Links</div>
      <div class="tree-item-flair-counter">
        <div class="tree-item-flair">{connectedNotes.links.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each connectedNotes.links as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <LinkIcon />
          {extractExt(link)}
        </div>
      {/each}
      {#if connectedNotes.links.length === 0}
        <div class="search-empty-state">No links found.</div>
      {/if}
    </div>
    <div class="tree-item-self">
      <div class="tree-item-inner">Backlinks</div>
      <div class="tree-item-flair-counter">
        <div class="tree-item-flair">{connectedNotes.backLinks.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each connectedNotes.backLinks as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <LinkIcon />
          {extractExt(link)}
        </div>
      {/each}
      {#if connectedNotes.backLinks.length === 0}
        <div class="search-empty-state">No back links found.</div>
      {/if}
    </div>
    <div class="tree-item-self">
      <div class="tree-item-inner">New Links</div>
      <div class="tree-item-flair-counter">
        <div class="tree-item-flair">{connectedNotes.newLinks.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each connectedNotes.newLinks as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <NewLinkIcon />
          {link}
        </div>
      {/each}
      {#if connectedNotes.newLinks.length === 0}
        <div class="search-empty-state">No new links found.</div>
      {/if}
    </div>
  {/if}
</div>

<style>
</style>
