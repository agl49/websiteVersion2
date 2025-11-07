import { postList } from '../../../lib/constants.js';

export async function load({ params }) {
  const post = await import(`../${params.slug}.md`);
  const { title, date, categories } = post.metadata;
  const content = post.default;

  // console.log('slug page');
  // console.log(post.metadata);

  return {
    content,
    title,
    date,
    categories
  };
}

// /** @type {import('./$types').EntryGenerator} */
export function entries() {
  let posts = [];

  for (let i = 0; i < postList.length; i++) {
    posts.push({ slug: postList[i] });
  }

  return posts;
}

export const prerender = true;
