import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorks } from '@/components/how-it-works'
import { PromotionSection } from '@/components/promotion-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />
      <div>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PromotionSection />
      </div>
      <Footer />
    </main>
  )
}
