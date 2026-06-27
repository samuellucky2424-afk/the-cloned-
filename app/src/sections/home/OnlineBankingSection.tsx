import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Check, Lock, Bell, MessageSquare } from 'lucide-react'

const features = [
  { icon: Lock, text: 'Simple and secure login.' },
  { icon: Bell, text: 'Set up handy notifications.' },
  { icon: MessageSquare, text: 'Message us online.' },
]

export default function OnlineBankingSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section-padding bg-[#006A4D]" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="container-korvantis">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Phone Image */}
          <div className="flex-1 max-w-sm">
            <img
              src="/images/app-download.jpg"
              alt="Korvantis Imperial Bank mobile app"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          {/* Right: Content */}
          <div className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Online banking
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join our 10 million app users.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={20} className="text-[#7AB800] flex-shrink-0" />
                  <span className="text-white/90">{feature.text}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </section>
  )
}
