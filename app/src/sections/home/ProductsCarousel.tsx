import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const products = [
  {
    title: 'Mortgages',
    description: 'Find a mortgage deal that best suits your needs. Explore and compare our mortgage rates, or apply for a mortgage, online or in our app.',
    cta: 'Find your mortgage deal',
    image: '/images/product-mortgages.jpg',
  },
  {
    title: 'Current accounts',
    description: 'From everyday banking to bank accounts with added rewards, find what\'s right for you.',
    cta: 'View our current accounts',
    image: '/images/product-current.jpg',
  },
  {
    title: 'Investing',
    description: 'Whether you\'re an experienced investor or starting out, we have an investment product for you.',
    cta: 'Ways to invest',
    image: '/images/product-investing.jpg',
  },
  {
    title: 'Loans',
    description: 'The amount and rate you\'re offered will depend on your personal circumstances.',
    cta: 'Explore our loans',
    image: '/images/product-loans.jpg',
  },
  {
    title: 'Car finance',
    description: 'Check your eligibility before you apply. It takes about 5 minutes and won\'t affect your credit score.',
    cta: 'Check your eligibility',
    image: '/images/product-loans.jpg',
  },
]

export default function ProductsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useScrollReveal<HTMLDivElement>()

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="section-padding bg-[#F7F7F5]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">
          Our products
        </h2>

        <div className="relative">
          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] md:w-[320px] bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-[#1A1A1A] mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[#595959] mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#006A4D] hover:underline"
                  >
                    {product.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
