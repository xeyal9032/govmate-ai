import { sendEmail } from './client';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Deadline, Profile } from '@/types/database';
import { formatDate, daysUntil } from '@/lib/utils/format';
import type { Locale } from '@/lib/utils/language';

async function getEmailTemplate(): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('app_settings')
      .select('value')
      .eq('key', 'email_reminder_template')
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

const i18nStrings: Record<string, Record<string, string>> = {
  tr: {
    subject: 'Deadline Hatırlatması',
    greeting: 'Merhaba',
    dateLabel: 'Tarih',
    remaining: 'Kalan',
    days: 'gün',
    cta: 'Detayları Gör',
    disclaimer: 'Bu e-posta GovMate AI tarafından gönderilmiştir. Bu uygulama hukuki danışmanlık sağlamaz.',
  },
  de: {
    subject: 'Fristenerinnerung',
    greeting: 'Hallo',
    dateLabel: 'Datum',
    remaining: 'Verbleibend',
    days: 'Tage',
    cta: 'Details ansehen',
    disclaimer: 'Diese E-Mail wurde von GovMate AI gesendet. Diese Anwendung bietet keine Rechtsberatung.',
  },
  en: {
    subject: 'Deadline Reminder',
    greeting: 'Hello',
    dateLabel: 'Date',
    remaining: 'Remaining',
    days: 'days',
    cta: 'View Details',
    disclaimer: 'This email was sent by GovMate AI. This application does not provide legal advice.',
  },
  az: {
    subject: 'Son tarix xatırlatması',
    greeting: 'Salam',
    dateLabel: 'Tarix',
    remaining: 'Qalan',
    days: 'gün',
    cta: 'Təfərrüatları gör',
    disclaimer: 'Bu e-poçt GovMate AI tərəfindən göndərilmişdir. Bu tətbiq hüquqi məsləhət vermir.',
  },
  ru: {
    subject: 'Напоминание о сроке',
    greeting: 'Здравствуйте',
    dateLabel: 'Дата',
    remaining: 'Осталось',
    days: 'дней',
    cta: 'Посмотреть детали',
    disclaimer: 'Это письмо отправлено GovMate AI. Это приложение не предоставляет юридических консультаций.',
  },
  uk: {
    subject: 'Нагадування про термін',
    greeting: 'Вітаємо',
    dateLabel: 'Дата',
    remaining: 'Залишилось',
    days: 'днів',
    cta: 'Переглянути деталі',
    disclaimer: 'Цей лист надіслано GovMate AI. Цей додаток не надає юридичних консультацій.',
  },
  ar: {
    subject: 'تذكير بالموعد النهائي',
    greeting: 'مرحبًا',
    dateLabel: 'التاريخ',
    remaining: 'المتبقي',
    days: 'أيام',
    cta: 'عرض التفاصيل',
    disclaimer: 'تم إرسال هذا البريد بواسطة GovMate AI. هذا التطبيق لا يقدم استشارات قانونية.',
  },
};

export async function sendDeadlineReminder(
  profile: Profile,
  deadline: Deadline
) {
  const lang = profile.preferred_language || 'tr';
  const t = i18nStrings[lang] || i18nStrings.en;
  const days = daysUntil(deadline.deadline_date);
  const dateStr = formatDate(deadline.deadline_date, lang as Locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const subject = `GovMate AI - ${t.subject}: ${deadline.title}`;
  const detailsUrl = `${appUrl}/${lang}/dashboard/deadlines`;

  const customTemplate = await getEmailTemplate();

  let html: string;
  if (customTemplate) {
    html = customTemplate
      .replace(/\{\{greeting\}\}/g, t.greeting)
      .replace(/\{\{userName\}\}/g, profile.full_name || '')
      .replace(/\{\{deadlineTitle\}\}/g, deadline.title)
      .replace(/\{\{dateLabel\}\}/g, t.dateLabel)
      .replace(/\{\{dateStr\}\}/g, dateStr)
      .replace(/\{\{remaining\}\}/g, t.remaining)
      .replace(/\{\{days\}\}/g, String(days))
      .replace(/\{\{daysLabel\}\}/g, t.days)
      .replace(/\{\{description\}\}/g, deadline.description || '')
      .replace(/\{\{ctaUrl\}\}/g, detailsUrl)
      .replace(/\{\{ctaText\}\}/g, t.cta)
      .replace(/\{\{disclaimer\}\}/g, t.disclaimer)
      .replace(/\{\{dir\}\}/g, dir);
  } else {
    html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; direction: ${dir};">
      <h2 style="color: #4F46E5;">GovMate AI - ${t.subject}</h2>
      <p>${t.greeting} ${profile.full_name || ''},</p>
      <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <strong>${deadline.title}</strong><br>
        ${t.dateLabel}: ${dateStr}<br>
        ${t.remaining}: ${days} ${t.days}
      </div>
      ${deadline.description ? `<p>${deadline.description}</p>` : ''}
      <p>
        <a href="${detailsUrl}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ${t.cta}
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
      <p style="font-size: 12px; color: #9CA3AF;">
        ${t.disclaimer}
      </p>
    </div>
  `;
  }

  return sendEmail({ to: profile.email, subject, html });
}
