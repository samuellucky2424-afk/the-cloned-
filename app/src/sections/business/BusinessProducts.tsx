import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Building2, CreditCard, TrendingUp, PiggyBank, Shield, BarChart3 } from 'lucide-react'

const products = [
  {
    icon: Building2,
    title: 'Business Accounts',
    description: 'Find the right account for your business, whether you\'re just starting out or well established.',
    cta: 'View accounts',
  },
  {
    icon: CreditCard,
    title: 'Business Credit Cards',
    description: 'Manage your cash flow and expenses with a business credit card.',
    cta: 'View cards',
  },
  {
    icon: TrendingUp,
    title: 'Business Loans',
    description: 'Finance your growth with flexible business lending options.',
    cta: 'View loans',
  },
  {
    icon: PiggyBank,
    title: 'Business Savings',
    description: 'Make your surplus cash work harder with our savings accounts.',
    cta: 'View savings',
  },
  {
    icon: Shield,
    title: 'Business Insurance',
    description: 'Protect your business with comprehensive insurance cover.',
    cta: 'View insurance',
  },
  {
    icon: BarChart3,
    title: 'Merchant Services',
    description: 'Accept card payments in-store, online and on the go.',
    cta: 'View services',
  },
]

export default function BusinessProducts() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#F7F7F5]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-seagate">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-4">
          Boost your business with us
        </h2>
        <p className="text-base text-[#595959] text-center mb-12 max-w-2xl mx-auto">
          Find the best products and support to help grow your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-[#E6F2ED] rounded-lg flex items-center justify-center mb-4">
                <product.icon size={24} className="text-[#006A4D]" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A1A] mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-[#595959] mb-4 leading-relaxed">
                {product.description}
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#006A4D] hover:underline"
              >
                {product.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
