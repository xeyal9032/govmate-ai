'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const authorities = [
  { name: 'Jobcenter', logo: '/authorities/ba.png', url: 'https://www.arbeitsagentur.de' },
  { name: 'Agentur für Arbeit', logo: '/authorities/ba.png', url: 'https://www.arbeitsagentur.de' },
  { name: 'Ausländerbehörde', logo: '/authorities/bmi.png', url: 'https://www.bamf.de' },
  { name: 'Finanzamt', logo: '/authorities/bmf.png', url: 'https://www.bzst.de' },
  { name: 'Krankenkasse', logo: '/authorities/aok.png', url: 'https://www.aok.de' },
  { name: 'Rentenversicherung', logo: '/authorities/drv.png', url: 'https://www.deutsche-rentenversicherung.de' },
  { name: 'Familienkasse', logo: '/authorities/ba.png', url: 'https://www.familienkasse.de' },
  { name: 'BAMF', logo: '/authorities/bmi.png', url: 'https://www.bamf.de' },
  { name: 'Bürgeramt', logo: '/authorities/adler.png', url: 'https://service.berlin.de' },
  { name: 'Wohnungsamt', logo: '/authorities/adler.png', url: 'https://www.bmwsb.bund.de' },
  { name: 'Versicherung', logo: '/authorities/tk.png', url: 'https://www.tk.de' },
  { name: 'Schule / Kita / Universität', logo: '/authorities/bmbf.png', url: 'https://www.bmbf.de' },
  { name: 'Vermieter / Wohnung', logo: '/authorities/adler.png', url: 'https://www.mieterbund.de' },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

export function AuthoritiesSection() {
  const t = useTranslations('landing.authorities');

  return (
    <section className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {authorities.map((authority) => (
              <motion.div key={authority.name} variants={itemVariants}>
                <a
                  href={authority.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full border-0 shadow-none transition-all hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                    <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white dark:bg-white p-2.5 shadow-sm">
                        <Image
                          src={authority.logo}
                          alt={authority.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium leading-tight">
                        {authority.name}
                      </span>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
