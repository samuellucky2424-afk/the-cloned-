import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function GoGettersSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="flex flex-col md:flex-row items-stretch gap-0 rounded-lg overflow-hidden shadow-lg">
          {/* Left: Image */}
          <div className="flex-1 min-h-[300px] md:min-h-[400px]">
            <img
              src="/images/go-getters.jpg"
              alt="Ambitious professional reaching out"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex-1 bg-[#F7F7F5] p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Go Getters
            </h2>
            <p className="text-base text-[#595959] mb-6 leading-relaxed">
              Over 14 million people bank with Korvantis Imperial Bank to help turn plans into reality.
            </p>
            <p className="text-sm text-[#595959] mb-8">
              *Internal customer data, May 2026.
            </p>
            <Link
              to="/register"
              className="btn-secondary self-start"
            >
              More about Bank on Korvantis Imperial
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
