import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Wallet, PiggyBank, ArrowRightLeft, Home } from 'lucide-react'

const products = [
  {
    icon: Wallet,
    title: 'International current accounts',
    description: 'Our accounts give you a great range of features for your daily needs. You can get them in sterling, euro and US dollar.',
    cta: 'Explore current accounts',
  },
  {
    icon: PiggyBank,
    title: 'International savings accounts',
    description: 'Save money in multiple currencies with our range of savings accounts.',
    cta: 'Explore savings accounts',
  },
  {
    icon: ArrowRightLeft,
    title: 'Foreign exchange services',
    description: 'Move money between different currencies and make international payments.',
    cta: 'Explore FX services',
  },
  {
    icon: Home,
    title: 'International buy-to-let mortgages',
    description: 'If you want to acquire an investment rental property or add to your existing rental portfolio in the UK, we can help.',
    cta: 'Explore mortgages',
  },
]

export default function InternationalProducts() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-4">
          Our international products
        </h2>
        <p className="text-base text-[#595959] text-center mb-12 max-w-2xl mx-auto">
          Wherever life takes you, bank with confidence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-[#F7F7F5] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-[#006A4D] rounded-lg flex items-center justify-center mb-4">
                <product.icon size={24} className="text-white" />
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

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
            Where global living meets trusted expertise
          </h3>
          <p className="text-base text-[#595959] mb-4 leading-relaxed">
            Whether you are moving abroad, living as an expat or settling into the UK, we make managing your money simple. With accounts in multiple currencies, fee-free international payments and 24/7 digital banking, you can stay in control wherever life takes you.
          </p>
          <p className="text-base text-[#595959] mb-6 leading-relaxed">
            Your money is held in a secure, well regulated jurisdiction. Plus if you have more than £250,000 or the currency equivalent with us, you will have a dedicated relationship manager to offer clear guidance, coordinate expertise and support you as your needs grow.
          </p>
          <p className="text-lg font-semibold text-[#1A1A1A]">
            Whatever comes next, you can bank on Korvantis Imperial Bank.
          </p>
        </div>
      </div>
    </section>
  )
}
