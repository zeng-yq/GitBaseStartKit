import { getPostData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = await getPostData(slug);
  return {
    title: `${postData.title}`,
    description: postData.description || `Read about ${postData.title} on GitBase`,
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="mx-2" size={16} />
        <Link href="/posts" className="hover:text-blue-600">Articles</Link>
        <ChevronRight className="mx-2" size={16} />
        <span className="text-gray-900">{postData.title}</span>
      </nav>

      {/* Article meta information below breadcrumb */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
        {postData.date && (
          <time>{new Date(postData.date).toLocaleDateString()}</time>
        )}
        {postData.category && (
          <>
            <span>•</span>
            <span className="font-medium">{postData.category}</span>
          </>
        )}
      </div>

      {/* Article content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />

      {/* Back to articles link */}
      <div className="mt-12">
        <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to articles
        </Link>
      </div>
    </article>
  );
}