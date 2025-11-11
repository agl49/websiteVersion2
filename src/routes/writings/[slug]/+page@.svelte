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
    selectTag.set(selected);
    goto(base + '/writings');
  }
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
              class="tagbutton"
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

  .tagbutton {
    color: white;
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
</style>
