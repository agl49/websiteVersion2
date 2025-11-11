<script>
  import Menu from '$lib/components/textMenu.svelte';
  import { pageButtons, socialLinks } from '../lib/constants';
  import { MediaQuery } from 'svelte/reactivity';
  import ThreeJsLogo from '../lib/components/threeJsLogo.svelte';
  import '@fontsource/source-code-pro'; // Defaults to weight 400
  import { Canvas } from '@threlte/core';
  import ShaderComponent from '../lib/shaders/backgroundShader.svelte';
  import MobileBackgroundShader from '../lib/shaders/mobileBackgroundShader.svelte';
  import { onMount } from 'svelte';

  let { children } = $props();
  let canvasContainer = $state(0);
  let canvasWidth = $state(500);
  let canvasHeight = $state(500);

  const small = new MediaQuery('max-width: 768px');

  function updateCanvasSize() {
    if (canvasContainer) {
      canvasWidth = canvasContainer.clientWidth;
      canvasHeight = canvasContainer.clientHeight;
    }
  }

  onMount(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  });
</script>

<svelte:window on:resize={updateCanvasSize} />

{#if !small.current}
  <div class="shader-container" bind:this={canvasContainer}>
    <Canvas
      size={{ width: canvasWidth, height: canvasHeight }}
      rendererParameters={{ alpha: true, antialias: true }}
    >
      <ShaderComponent />
    </Canvas>
  </div>
{:else}
  <div class="shader-container-m" bind:this={canvasContainer}>
    <Canvas
      size={{ width: canvasWidth, height: canvasHeight }}
      rendererParameters={{ alpha: true, antialias: true }}
    >
      <MobileBackgroundShader />
    </Canvas>
  </div>
{/if}

<div class="butt">
  <Menu buttons={pageButtons} />
</div>

<ThreeJsLogo />

{#if !small.current}
  <main class="largeMain">
    <div>
      {@render children()}
    </div>
  </main>
{:else}
  <main class="smallMain">
    <div>
      {@render children()}
    </div>
  </main>
{/if}

<div class="butt">
  <Menu buttons={socialLinks} />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Source Code Pro';
  }

  .largeMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: left;
    padding-left: 35%;
    padding-right: 35%;
    min-height: 100vh;
    color: white;
    z-index: 1;
  }

  .smallMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: left;
    padding-left: 15%;
    padding-right: 15%;
    min-height: 50vh;
    color: white;
    z-index: 1;
  }

  .butt {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .shader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }

  .shader-container-m {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
</style>
