import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Blog — S.Religious Tours" };

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl text-ink">Blog</h1>
        <p className="mt-2 text-ink-soft">Guides, updates, and stories from our Ziarat and Umrah groups.</p>

        {posts && posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                <h2 className="font-heading text-lg text-ink">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-ink-soft">
            New posts are coming soon. In the meantime, reach out to us on WhatsApp for any questions about our
            upcoming departures.
          </p>
        )}
      </div>
    </section>
  );
}
