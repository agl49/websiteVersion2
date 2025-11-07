import { writable } from 'svelte/store';

let selectTag = writable('numbers');

export { selectTag };
