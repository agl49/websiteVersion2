<script>
  import { categoryTags } from '$lib/constants';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';

  const selectTag = writable('');
  setContext('selectedTag', selectTag);

  let options = $state(categoryTags);

  function onChange(event) {
    $selectTag = event.target.value;
    // console.log('selectTag: ', $selectTag);
  }

  let { children } = $props();
</script>

<div class="mainBlogMenu" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
  <h2>Posts</h2>
  <h3>Filter Posts By Tag</h3>
  <select class="typeMenu" onchange={onChange}>
    {#each options as option}
      <option class="optionStyle" value={option}>{option}</option>
    {/each}
  </select>

  {@render children()}
</div>

<style>
  .mainBlogMenu {
    /* width: 550px; */
    max-width: 100%;
    /* padding-right: 33%; */
    /* padding-left: 33%; */
  }
  h2 {
    text-align: center;
  }

  .typeMenu {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background-color: rgb(255, 255, 255, 0);
    color: white;
    font-size: 1em;
    border: 0px solid #c4d1eb;
    border-radius: 1rem;
  }

  .optionStyle {
    background-color: white;
    color: black;
  }
</style>
