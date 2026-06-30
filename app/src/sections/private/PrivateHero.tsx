import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function PrivateHero() {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative min-h-[600px] md:min-h-[650px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/private-hero.jpg"
          alt="Private banking professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-seagate flex items-center justify-center min-h-[600px] md:min-h-[650px]">
        <div 
          ref={contentRef}
          className="text-center max-w-2xl py-16 md:py-24"
          style={{ opacity: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The best way forward
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Seagate Metal Private Banking could help you realise the true value of your wealth.
          </p>
          <Link
            to="#"
            className="btn-primary"
          >
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  )
}
