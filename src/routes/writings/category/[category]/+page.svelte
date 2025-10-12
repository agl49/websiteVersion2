<script>
  import { base } from '$app/paths';
  import { fade } from 'svelte/transition';
  import { getContext } from 'svelte';

  // export let data;
  let { data } = $props();
  let tag = $state('');

  let selectedTag = getContext('selectedTag');
  $effect(() => (tag = $selectedTag));

  let filteredPosts = $derived(
    data.posts.filter((post) => {
      if ($selectedTag && post) {
        let temp = post.meta.categories;
        return temp.includes(tag);
      } else {
        return true;
      }
    })
  );
</script>

<div class="secondaryBlogMenu" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
  <ul>
    {#each filteredPosts as post}
      <li>
        <h2>
          <a href={base + post.path}>
            {post.meta.title}
          </a>
        </h2>
        Published {post.meta.date}
      </li>
    {/each}
  </ul>
</div>

<style>
  .secondaryBlogMenu {
    /* width: 550px; */
    max-width: 100%;
    text-align: left;
  }
</style>
