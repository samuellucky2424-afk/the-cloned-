import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function InternationalHero() {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative min-h-[600px] md:min-h-[650px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/international-hero.jpg"
          alt="International travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-korvantis flex items-center min-h-[600px] md:min-h-[650px]">
        <div 
          ref={contentRef}
          className="max-w-xl py-16 md:py-24"
          style={{ opacity: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Free to roam
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Get fee-free spending on your debit card in 200 countries worldwide.
          </p>
          <Link
            to="#"
            className="btn-primary"
          >
            Explore our range of current accounts
          </Link>
        </div>
      </div>
    </section>
  )
}
