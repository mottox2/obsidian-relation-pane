<script lang="ts">
  import store from "src/store"
  import LinkIcon from "./LinkIcon.svelte"
  import NewLinkIcon from "./NewLinkIcon.svelte"
  import type { Settings } from "../settings"

  export let openLink: (event: MouseEvent, link: string) => void
  export let settings: Settings

  const { experimentalHideFolderPath } = settings;

  const extractFolderName = (path: string) => {
    if (!experimentalHideFolderPath) return path
    const parts = path.split("/")
    return parts[parts.length - 1]
  }

  const fileName = (path: string) => {
    const name = path.replace(/.md$/, "")
    return extractFolderName(name)
  }
</script>

<div class="backlink-pane">
  {#if $store.noActiveFile}
    <div class="pane-empty">No active file.</div>
  {:else}
    <div class="tree-item-self">
      <div class="tree-item-inner">Links</div>
      <div class="tree-item-flair-outer">
        <div class="tree-item-flair">{$store.links.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each $store.links as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <LinkIcon />
          {fileName(link)}
        </div>
      {/each}
      {#if $store.links.length === 0}
        <div class="search-empty-state">No links found.</div>
      {/if}
    </div>
    <div class="tree-item-self">
      <div class="tree-item-inner">Backlinks</div>
      <div class="tree-item-flair-outer">
        <div class="tree-item-flair">{$store.backLinks.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each $store.backLinks as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <LinkIcon />
          {fileName(link)}
        </div>
      {/each}
      {#if $store.backLinks.length === 0}
        <div class="search-empty-state">No back links found.</div>
      {/if}
    </div>
    {#each Object.keys($store.twoHopLinks) as file}
      {@const links = $store.twoHopLinks[file]}
      {#if links.length > 0}
        <div class="tree-item-self">
          <div class="tree-item-inner">{fileName(file)}</div>
          <div class="tree-item-flair-outer">
            <div class="tree-item-flair">{links.length}</div>
          </div>
        </div>
        <div class="search-result-container">
          {#each links as link}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="tree-item-self search-result-file-title is-clickable"
              on:click={(e) => openLink(e, link)}
            >
              <LinkIcon />
              {fileName(link)}
            </div>
          {/each}
        </div>
      {/if}
    {/each}
    <div class="tree-item-self">
      <div class="tree-item-inner">New Links</div>
      <div class="tree-item-flair-outer">
        <div class="tree-item-flair">{$store.newLinks.length}</div>
      </div>
    </div>
    <div class="search-result-container">
      {#each $store.newLinks as link}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="tree-item-self search-result-file-title is-clickable"
          on:click={(e) => openLink(e, link)}
        >
          <NewLinkIcon />
          {fileName(link)}
        </div>
      {/each}
      {#if $store.newLinks.length === 0}
        <div class="search-empty-state">No new links found.</div>
      {/if}
    </div>
  {/if}
</div>