import { getCollection, type CollectionEntry } from "astro:content";
import { sortBlogPosts } from "./sort-blog-posts";

export type BlogPost = CollectionEntry<"blog">;

// Blog publication-state helpers.
//
// Why these exist:
// - `draft: true` means "not public at all"
// - a future `publishDate` means "scheduled" rather than "draft"
// - published surfaces like `/blog` and author archives should only show posts
//   that are live at build time
//
// Mental model:
//   draft post
//     -> never appears on public blog surfaces
//   scheduled post (future publishDate)
//     -> gets a direct article URL, but stays off lists until the date is reached
//   live post
//     -> appears everywhere normal blog content appears
export function isScheduledBlogPost(post: BlogPost, at = new Date()): boolean {
  return !post.data.draft && post.data.publishDate.getTime() > at.getTime();
}

export function isPublishedBlogPost(post: BlogPost, at = new Date()): boolean {
  return !post.data.draft && !isScheduledBlogPost(post, at);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = sortBlogPosts(
    (await getCollection("blog")).filter((post) => isPublishedBlogPost(post))
  );

  const featuredPosts = posts.filter((post) => post.data.featured);
  if (featuredPosts.length > 1) {
    const slugs = featuredPosts.map((post) => post.data.slug ?? post.id).join(", ");
    throw new Error(`Only one blog post may set featured: true. Found: ${slugs}`);
  }

  return posts;
}
