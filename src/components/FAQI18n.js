// components/FAQI18n.js
'use client'

export default function FAQI18n({ dict }) {
  return (
    <section className="py-16 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{dict.faq.title}</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {dict.faq.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dict.faq.items.map((item, index) => (
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