import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { createHighlighter } from 'shiki';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await createHighlighter({
        themes: ['aurora-x'],
        langs: ['javascript', 'typescript', 'python', 'json']
      });
      await highlighter.loadLanguage('javascript', 'typescript', 'python', 'json');
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'aurora-x' }));
      return `{@html \`${html}\` }`;
    }
  }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // ignore deliberate link to shiny 404 page
        if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') {
          return;
        }

        if (message.includes('does not begin with `base`')) {
          return;
        }

        // otherwise fail the build
        throw new Error(message);
      },
      handleMissingId: 'ignore'
    },
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      config: undefined,
      platformProxy: {
        configPath: undefined,
        environment: undefined,
        persist: undefined
      },
      fallback: 'plaintext',
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  },

  extensions: ['.svelte', '.md'],

  preprocess: [mdsvex(mdsvexOptions)]
};

export default config;
