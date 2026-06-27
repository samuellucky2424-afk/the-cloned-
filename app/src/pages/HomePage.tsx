import HeroSection from '../sections/home/HeroSection'
import QuickLinks from '../sections/home/QuickLinks'
import AppSection from '../sections/home/AppSection'
import ProductsCarousel from '../sections/home/ProductsCarousel'
import GoGettersSection from '../sections/home/GoGettersSection'
import CustomerSupportSection from '../sections/home/CustomerSupportSection'
import CoServicingSection from '../sections/home/CoServicingSection'
import CashInOutSection from '../sections/home/CashInOutSection'
import CreditScoreSection from '../sections/home/CreditScoreSection'
import OnlineBankingSection from '../sections/home/OnlineBankingSection'
import SurveyResultsSection from '../sections/home/SurveyResultsSection'
import APPScamsSection from '../sections/home/APPScamsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickLinks />
      <AppSection />
      <ProductsCarousel />
      <GoGettersSection />
      <CustomerSupportSection />
      <CoServicingSection />
      <CashInOutSection />
      <CreditScoreSection />
      <OnlineBankingSection />
      <SurveyResultsSection />
      <APPScamsSection />
    </>
  )
}
