// components/FAQ.js
'use client'

export default function FAQ() {
  const faqItems = [
    {
      question: "What is GitBase?",
      answer: "GitBase is an open-source dynamic website CMS that operates without a database. It's built with Next.js, Tailwind CSS, and Shadcn/UI."
    },
    {
      question: "Do I need a database?",
      answer: "No, GitBase doesn't require a traditional database. It uses GitHub API for content management, making it lightweight and easy to deploy."
    },
    {
      question: "Is GitBase really free?",
      answer: "Yes, GitBase is completely free and open-source. You can use it for personal and commercial projects without any licensing fees."
    },
    {
      question: "How do I add content?",
      answer: "Content is managed through GitHub. You can create, edit, and manage your articles and resources directly through the GitHub interface."
    },
    {
      question: "Can I contribute to GitBase?",
      answer: "Absolutely! GitBase is open-source and welcomes contributions. You can submit pull requests, report issues, or suggest new features."
    },
    {
      question: "What technologies are used?",
      answer: "GitBase is built with Next.js, Tailwind CSS for styling, and Shadcn/UI for components. It leverages GitHub's API for content management."
    }
  ]

  return (
    <section className="py-4 md:py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have another question? Contact us at support@example.com
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 border-2 border-blue-600 text-blue-600 rounded-md flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">{item.question}</h3>
                <p className="text-gray-600 text-sm">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}