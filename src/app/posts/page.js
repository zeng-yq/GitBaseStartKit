import ArticleList from '@/components/ArticleList'
import { getSortedPostsData } from '@/lib/posts'
import { getDictionary } from '@/lib/get-dictionary'

export const metadata = {
  title: 'Articles',
  description: 'Read our latest articles on web development, GitHub tips, and best practices.',
};

export default async function Articles() {
  const allPostsData = getSortedPostsData();
  const dict = await getDictionary('en'); // Default to English

  return (
    <div className="container mx-auto py-12">
      <ArticleList articles={allPostsData} showMoreLink={false} dict={dict} />
    </div>
  )
}

