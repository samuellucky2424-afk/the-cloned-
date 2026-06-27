import BusinessHero from '../sections/business/BusinessHero'
import BusinessQuickLinks from '../sections/business/BusinessQuickLinks'
import MTDBanner from '../sections/business/MTDBanner'
import BusinessProducts from '../sections/business/BusinessProducts'

export default function BusinessPage() {
  return (
    <>
      <BusinessHero />
      <BusinessQuickLinks />
      <MTDBanner />
      <BusinessProducts />
    </>
  )
}
