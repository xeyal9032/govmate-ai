'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { localeNames, localeFlagUrls, type Locale } from '@/lib/utils/language';

const supportedLocales: Locale[] = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'];

const colors = [
  'from-red-500/10 to-red-500/5 border-red-500/20 hover:shadow-red-500/10',
  'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:shadow-yellow-500/10',
  'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-blue-500/10',
  'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:shadow-emerald-500/10',
  'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-purple-500/10',
  'from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:shadow-sky-500/10',
  'from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-green-500/10',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function LanguagesSection() {
  const t = useTranslations('landing.languages');

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20"
          >
            <Globe className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
        >
          {supportedLocales.map((locale, i) => (
            <motion.div
              key={locale}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group"
            >
              <div
                className={`relative flex flex-col items-center gap-3 rounded-2xl border bg-gradient-to-b p-5 shadow-md transition-shadow duration-300 hover:shadow-lg ${colors[i]}`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <img
                    src={localeFlagUrls[locale]}
                    alt={localeNames[locale]}
                    width={48}
                    height={32}
                    className="aspect-[3/2] rounded-md object-cover shadow-md ring-1 ring-black/5"
                  />
                  <div className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-br from-white/50 to-white/0 blur-sm dark:from-white/10" />
                </motion.div>
                <span className="text-sm font-semibold">
                  {localeNames[locale]}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
