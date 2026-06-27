import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Compass, Users, Briefcase, Landmark } from 'lucide-react'

const services = [
  {
    icon: Compass,
    title: 'Wealth Planning',
    description: 'Our specialists work with you to understand your goals and create a bespoke plan to achieve them.',
  },
  {
    icon: Users,
    title: 'Dedicated Relationship Manager',
    description: 'A single point of contact who understands your needs and can connect you with specialists.',
  },
  {
    icon: Briefcase,
    title: 'Investment Management',
    description: 'Access to a wide range of investment solutions tailored to your risk appetite and objectives.',
  },
  {
    icon: Landmark,
    title: 'Banking Services',
    description: 'Exclusive products and preferential rates on savings, treasury services, and commercial banking.',
  },
]

export default function PrivateContent() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-white" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
          We call it 'relationship-led banking.'
        </h2>
        <p className="text-base text-[#595959] mb-8 leading-relaxed">
          At Korvantis Imperial Private Banking, we understand that many of our customers lead demanding lives and have needs that go beyond conventional banking. That's why we take care of them personally. We introduce customers to specialist partners to ensure they safely navigate the complex world of wealth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-[#F7F7F5] rounded-lg"
            >
              <div className="w-12 h-12 bg-[#006A4D] rounded-lg flex items-center justify-center mb-4">
                <service.icon size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A1A] mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-[#595959] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="#"
            className="btn-secondary"
          >
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  )
}
