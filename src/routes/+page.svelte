<script>
  import Card from '../lib/components/card.svelte';
  import { experience } from '../lib/constants';
  let nothing = $state(); // vscode calls this legacy mode other wise.
  import { fade, draw } from 'svelte/transition';
  import { base } from '$app/paths';
</script>

<main in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
  <!-- <Logo shader version /> -->
  <!-- TODO: move this to it's file -->
  <!-- <div class="shader-container" bind:this={canvasContainer}>
    <Canvas
      size={{ width: canvasWidth, height: canvasHeight }}
      rendererParameters={{ alpha: true, antialias: true }}
    >
      <T.Scene>
        <T.PerspectiveCamera makeDefault position={[0, 0, 2]} fov={75} near={0.1} far={1000} />

        <ShaderLogo {canvasWidth} {canvasHeight} />
      </T.Scene>
    </Canvas>
  </div> -->

  <div class="me">
    <p>
      I'm Adrian. You'll find anything I find intresting posted here as well as my work. For
      professional outreach, refer to my linkedin. Look here for my <a href="{base}/writings"
        >blog</a
      >
      and
      <a href="{base}/demos">personal projects</a>.
    </p>
    <h2>Experience</h2>
    {#each experience as ex}
      <Card {...ex} />
    {/each}
    <!-- Personal projects -->
    <!-- Fill once you have a more impressive personal projects to project -->
    <!-- Have be a direct link to markdown page that explains it -->
    <!-- On markdown page, have it linked to demo if you execute the code live on -->
    <!-- this site or to external site. -->
    <h2>Contact</h2>
    <p>
      You can reach out to me via linkedIn or by my email:
      <a href="mailto:adrianglopez98@gmail.com">adrianglopez98@gmail.com</a>
    </p>
  </div>
</main>

<style>
  .me {
    /* max-width: 550px; */
    max-width: 100%;

    /* padding-left: 33%; */
  }
  h2 {
    text-align: center;
  }
  p {
    text-align: left;
  }
</style>
