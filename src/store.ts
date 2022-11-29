import { writable } from "svelte/store";

type StoreValue = {
  noActiveFile: boolean;
  links: string[];
  backLinks: string[];
  newLinks: string[];
}

const store = writable<StoreValue>({
  noActiveFile: true,
  links: [],
  backLinks: [],
  newLinks: [],
});

export default store