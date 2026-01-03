import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { BLOG_POSTS } from "../../../lib/blog-data";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | Trust Rides Kenya`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <article className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black mb-8 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <div className="space-y-4 mb-8">
          <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <div className="text-xs text-gray-500 font-medium">
              Published on {post.date} • {post.readTime}
            </div>
            <button className="text-gray-400 hover:text-black transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-img:rounded-xl text-gray-600 leading-loose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Call to Action */}
        {post.relatedLink && (
          <div className="mt-12 bg-gray-900 rounded-xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Ready to find your car?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              We have a curated list of vehicles matching this category. Verified and ready for transfer.
            </p>
            <Link 
              href={post.relatedLink.url} 
              className="inline-block bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              {post.relatedLink.text}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}