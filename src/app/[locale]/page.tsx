import { setRequestLocale } from 'next-intl/server';
import { getAllPlanLimits } from '@/actions/billing';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { StatsSection } from '@/components/landing/stats-section';
import { VideoDemoSection } from '@/components/landing/video-demo-section';
import { SampleAnalysisSection } from '@/components/landing/sample-analysis-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TrustSecuritySection } from '@/components/landing/trust-security-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
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
        <StatsSection />
        <VideoDemoSection />
        <SampleAnalysisSection />
        <HowItWorksSection />
        <TrustSecuritySection />
        <TestimonialsSection />
        <AuthoritiesSection />
        <LanguagesSection />
        <PricingSection planLimits={planLimits} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
