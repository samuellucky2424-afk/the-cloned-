import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function BusinessHero() {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative min-h-[600px] md:min-h-[650px] bg-[#004D2A] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#00A86B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#7AB800]/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-seagate flex items-center min-h-[600px] md:min-h-[650px]">
        <div 
          ref={contentRef}
          className="max-w-2xl py-16 md:py-24"
          style={{ opacity: 0 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Business banking that works as hard as you
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-4">
            Open a business bank account by 9 July and get $200, no monthly fee, digital banking and 24/7 support.
          </p>
          <Link
            to="#"
            className="inline-block text-sm text-white/80 hover:text-white underline mb-8"
          >
            Terms and conditions of the $200 offer
          </Link>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="#" className="btn-primary text-center">
              Get a Business Account
            </Link>
          </div>

          {/* Fee change notice */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-white/80">
              From 10 July, Business Account fees are changing.{' '}
              <Link to="#" className="underline hover:text-white">
                See the guide to changes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
