import { getPostData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import TableOfContents from '@/components/TableOfContents';

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
    <div className="container py-12">
      <div className="flex gap-8 justify-center">
        {/* Main article content */}
        <article className="flex-1 max-w-3xl">
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

        {/* Table of Contents - Desktop only */}
        {postData.headings && postData.headings.length > 0 && (
          <aside
            className="hidden xl:block w-64 sticky top-24 h-fit"
            role="complementary"
            aria-label="Article Table of Contents"
          >
            <TableOfContents headings={postData.headings} />
          </aside>
        )}
      </div>
    </div>
  );
}