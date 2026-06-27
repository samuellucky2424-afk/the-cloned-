import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function CreditScoreSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#F7F7F5]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Your Credit Score
            </h2>
            <p className="text-base text-[#595959] mb-8 leading-relaxed max-w-md">
              Take control of your finances with the power to check your credit score for free. Find your score and your accounts all in one app.
            </p>
            <Link
              to="/login"
              className="btn-secondary"
            >
              Check Your Credit Score
            </Link>
          </div>

          {/* Right: Image */}
          <div className="flex-1 max-w-md">
            <img
              src="/images/credit-score.jpg"
              alt="Credit score dashboard"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
