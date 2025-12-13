"use client";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  dict: {
    testimonials: {
      title: string;
      subtitle: string;
      items: TestimonialItem[];
    };
  };
}

const Testimonials = ({ dict }: TestimonialsProps) => {
  const testimonials = dict.testimonials.items;

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background py-20 relative">
      <div className="container z-10 mx-auto">
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
            {dict.testimonials.title}
          </h2>
          <p className="text-center mt-5 opacity-75">
            {dict.testimonials.subtitle}
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;