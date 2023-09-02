import { writable, type Writable } from "svelte/store";

export const tasks: Writable<Array<string>> = writable([]);
