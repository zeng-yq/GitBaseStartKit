import { Features } from '@/components/Features'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'
import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects'
import { getDictionary } from '@/lib/get-dictionary'

export default async function AdminTemplatePage() {
  // Get English dictionary for testimonials
  const dict = await getDictionary('en');

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Template
        </h1>
        <h2 className="text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg">Template of Components</h2>
      </section>

      <Features />

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            New Features
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 text-base">
            Discover the powerful capabilities that make our platform stand out from the crowd
          </p>
        </div>
        <FeaturesSectionWithHoverEffects />
      </section>

      <Testimonials dict={dict} />
      <FAQ />
    </div>
  )
}