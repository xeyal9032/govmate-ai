'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, ExternalLink } from 'lucide-react';

const authorities = [
  { name: 'Jobcenter', logo: '/authorities/ba.svg', url: 'https://www.arbeitsagentur.de' },
  { name: 'Agentur für Arbeit', logo: '/authorities/ba.svg', url: 'https://www.arbeitsagentur.de' },
  { name: 'Ausländerbehörde', logo: '/authorities/bmi.svg', url: 'https://www.bamf.de' },
  { name: 'Finanzamt', logo: '/authorities/bmf.svg', url: 'https://www.bzst.de' },
  { name: 'Krankenkasse', logo: '/authorities/aok.svg', url: 'https://www.aok.de' },
  { name: 'Rentenversicherung', logo: '/authorities/drv.svg', url: 'https://www.deutsche-rentenversicherung.de' },
  { name: 'Familienkasse', logo: '/authorities/ba.svg', url: 'https://www.familienkasse.de' },
  { name: 'BAMF', logo: '/authorities/bmi.svg', url: 'https://www.bamf.de' },
  { name: 'Bürgeramt', logo: '/authorities/adler.svg', url: 'https://service.berlin.de' },
  { name: 'Wohnungsamt', logo: '/authorities/adler.svg', url: 'https://www.bmwsb.bund.de' },
  { name: 'Versicherung', logo: '/authorities/tk.svg', url: 'https://www.tk.de' },
  { name: 'Schule / Kita / Universität', logo: '/authorities/bmbf.svg', url: 'https://www.bmbf.de' },
  { name: 'Vermieter / Wohnung', logo: '/authorities/adler.svg', url: 'https://www.mieterbund.de' },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function AuthoritiesSection() {
  const t = useTranslations('landing.authorities');

  return (
    <section id="authorities" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-400">
            <Building2 className="h-3.5 w-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
          <p className="mt-3 text-sm font-medium text-primary">
            {t('count', { count: authorities.length })}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
        >
          {authorities.map((authority) => (
            <motion.div key={authority.name} variants={itemVariants}>
              <a
                href={authority.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <div className="relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-border/60 bg-card/80 px-2 py-4 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:rounded-2xl sm:px-3 sm:py-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-white p-2 shadow-sm transition-all group-hover:scale-105 dark:bg-white">
                    <Image
                      src={authority.logo}
                      alt={authority.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  <span className="relative text-xs font-semibold leading-snug sm:text-sm">
                    {authority.name}
                  </span>

                  <ExternalLink className="relative mt-2 h-3.5 w-3.5 text-muted-foreground/0 transition-all group-hover:text-primary/70" />
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
