<script>
  import { fade } from 'svelte/transition';
  import { base } from '$app/paths';
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectTag } from '../tag_state';

  let { data } = $props();
  let selected = $state('');

  const Content = $derived(data.content);

  function clickTag() {
    //debugging
    console.log('in category');
    console.log(typeof $selectTag);
    console.log('selected category is: ' + selected);
    console.log('in tag buttong selectTag value: ' + $selectTag);

    selectTag.set(selected);
    goto(base + '/writings');
  }

  // console.log('page data');
  // console.log(data);
</script>

<div class="markdown" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
  <article>
    <h1>{data.title}</h1>
    <p>Published: {data.date}</p>
    <Content />
  </article>

  {#if data.categories.length}
    <aside>
      <h2>Posted in:</h2>
      <ul>
        {#each data.categories as category}
          <li>
            <!-- <a href="{base}/writings/category/{category}">
              {category}
            </a> -->
            <button
              onclick={() => {
                selected = category;
                clickTag();
              }}
            >
              {category}
            </button>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</div>

<style>
  .markdown {
    /* width: 550px;
    max-width: 550px; */
    max-width: 100%;
    text-align: left;
  }
</style>
