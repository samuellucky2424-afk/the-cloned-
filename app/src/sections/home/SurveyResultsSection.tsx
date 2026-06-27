import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const bankRatings = [
  { name: 'Monzo', percentage: 82 },
  { name: 'Starling Bank', percentage: 77 },
  { name: 'Nationwide', percentage: 74 },
  { name: 'First Direct', percentage: 73 },
  { name: 'Chase', percentage: 72 },
  { name: 'Korvantis Imperial Bank', percentage: 65 },
]

export default function SurveyResultsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-4">
          Independent service quality survey results
        </h2>
        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
          Personal current accounts
        </h3>
        <p className="text-sm text-[#595959] mb-8">
          Published February 2026
        </p>

        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-sm text-[#595959] mb-6 leading-relaxed">
            As part of a regulatory requirement, an independent survey was conducted to ask approximately <strong>1,000</strong> customers of each of the <strong>17 largest personal current account providers</strong> if they would recommend their provider to friends and family. The results represent the view of customers who took part in the survey.
          </p>

          <h4 className="font-semibold text-lg text-[#1A1A1A] mb-4">
            Overall service quality
          </h4>
          <p className="text-sm text-[#595959] mb-6">
            We asked customers how likely they would be to recommend their personal current account provider to friends and family.
          </p>

          {/* Ratings Chart */}
          <div className="space-y-3">
            {bankRatings.map((bank, index) => (
              <div key={bank.name} className="flex items-center gap-4">
                <span className="text-sm text-[#595959] w-6">{index + 1}</span>
                <span className="text-sm font-medium text-[#1A1A1A] w-28">{bank.name}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      bank.name === 'Korvantis Imperial Bank' ? 'bg-[#006A4D]' : 'bg-gray-300'
                    }`}
                    style={{ width: `${bank.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A] w-10 text-right">
                  {bank.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="#" className="text-sm text-[#006A4D] hover:underline">
            View the full set of results
          </Link>
          <Link to="#" className="text-sm text-[#006A4D] hover:underline">
            Korvantis Imperial Bank Service Quality Information page
          </Link>
        </div>
      </div>
    </section>
  )
}
