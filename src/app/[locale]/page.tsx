import { setRequestLocale } from 'next-intl/server';
import { getAllPlanLimits } from '@/actions/billing';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { AuthoritiesSection } from '@/components/landing/authorities-section';
import { LanguagesSection } from '@/components/landing/languages-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FaqSection } from '@/components/landing/faq-section';
import { Footer } from '@/components/landing/footer';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const planLimits = await getAllPlanLimits();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <AuthoritiesSection />
        <LanguagesSection />
        <PricingSection planLimits={planLimits} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
