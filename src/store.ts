import { writable } from "svelte/store";

type StoreValue = {
  noActiveFile: boolean;
  links: string[];
  backLinks: string[];
  newLinks: string[];
  twoHopLinks: Record<string, string[]>
}

const store = writable<StoreValue>({
  noActiveFile: true,
  links: [],
  backLinks: [],
  newLinks: [],
  twoHopLinks: {},
});

export default store