import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorks } from '@/components/how-it-works'
import { PromotionSection } from '@/components/promotion-section'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { WebAppSchema, FAQSchema } from './schema'

export default function Home() {
  return (
    <main className="flex flex-col">
      <WebAppSchema />
      <FAQSchema />
      <Header />
      <div>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <FAQSection />
        <PromotionSection />
      </div>
      <Footer />
    </main>
  )
}
