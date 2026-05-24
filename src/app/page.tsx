import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import PromptsTeaser from '@/components/landing/PromptsTeaser'
import Pillars from '@/components/landing/Pillars'
import MidCTA from '@/components/landing/MidCTA'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromptsTeaser />
        <Pillars />
        <MidCTA />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
