'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Briefcase,
  Globe,
  Building2,
  Calculator,
  HeartPulse,
  Landmark,
  Users,
  Shield,
  UserCheck,
  Home,
  ShieldCheck,
  GraduationCap,
  KeyRound,
} from 'lucide-react';

const authorities = [
  { name: 'Jobcenter', icon: Briefcase },
  { name: 'Agentur für Arbeit', icon: Building2 },
  { name: 'Ausländerbehörde', icon: Globe },
  { name: 'Finanzamt', icon: Calculator },
  { name: 'Krankenkasse', icon: HeartPulse },
  { name: 'Rentenversicherung', icon: Landmark },
  { name: 'Familienkasse', icon: Users },
  { name: 'BAMF', icon: Shield },
  { name: 'Bürgeramt', icon: UserCheck },
  { name: 'Wohnungsamt', icon: Home },
  { name: 'Versicherung', icon: ShieldCheck },
  { name: 'Schule / Kita / Uni', icon: GraduationCap },
  { name: 'Vermieter / Wohnung', icon: KeyRound },
];

export function LandingAuthorities() {
  const t = useTranslations('landing.authorities');

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {authorities.map((auth, i) => (
            <motion.div
              key={auth.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-md transition-shadow cursor-default border-0 shadow-sm">
                <CardContent className="p-4">
                  <auth.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">{auth.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
