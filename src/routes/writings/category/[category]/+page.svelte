<script>
  import { base } from '$app/paths';

  export let data;
</script>

<div class="secondaryBlogMenu">
  <h1>Blog2</h1>

  <ul>
    {#each data.posts as post}
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
    width: 550px;
    text-align: left;
  }
</style>
