import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { BLOG_POSTS } from "../../lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Buying Guide & Reviews Kenya | Trust Rides Blog",
  description: "Expert advice on fuel efficient cars, car maintenance, and importing vehicles in Kenya. Read our latest guides.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-4 tracking-tight">
            The Driver's Seat
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Insights, reviews, and guides for the Kenyan motorist. From NTSA transfer fees to market analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  <span className="text-blue-600">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-black mb-3 group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-black group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}