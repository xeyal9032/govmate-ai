# GovMate AI

Almaniyada yaşayan xaricilər üçün AI rəsmi sənəd köməkçisi.

İstifadəçi rəsmi məktubu (PDF, foto, mətn) yükləyir → sistem oxuyur → sadə dildə izah edir → deadline çıxarır → lazım olan sənədləri göstərir → cavab məktubu hazırlayır → istifadəçinin dilinə tərcümə edir.

## Tech Stack

- **Frontend:** Next.js 15+, App Router, TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Lucide React, Framer Motion
- **Backend:** Next.js Route Handlers + Server Actions
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **File Storage:** Supabase Storage
- **AI:** OpenAI Responses API
- **Payments:** Stripe Billing
- **Email:** Resend
- **i18n:** next-intl (7 dil: TR, DE, EN, AZ, RU, UK, AR)
- **Validation:** Zod + React Hook Form

## Quraşdırma

### 1. Repository klonla

```bash
git clone <repo-url>
cd govmate-ai
npm install
```

### 2. Environment Variables

`.env.example` faylını `.env.local` olaraq kopyala və doldur:

```bash
cp .env.example .env.local
```

### 3. Supabase Setup

1. [supabase.com](https://supabase.com) saytında yeni layihə yarat
2. `NEXT_PUBLIC_SUPABASE_URL` və `NEXT_PUBLIC_SUPABASE_ANON_KEY` dəyərlərini Project Settings > API-dən al
3. `SUPABASE_SERVICE_ROLE_KEY` dəyərini eyni yerdən al
4. Migration fayllarını icra et:

```bash
npx supabase db push
```

Və ya SQL Editor-da `supabase/migrations/` qovluğundakı faylları sıra ilə icra et.

### 4. OpenAI Setup

1. [platform.openai.com](https://platform.openai.com) saytından API key al
2. `.env.local` faylına `OPENAI_API_KEY` olaraq əlavə et

### 5. Stripe Setup

1. [stripe.com](https://stripe.com) saytında hesab yarat
2. Dashboard > Developers > API Keys-dən key-ləri al
3. İki məhsul yarat (Pro və Business planları)
4. Price ID-ləri `.env.local`-a əlavə et
5. Webhook endpoint-i qur: `https://yourdomain.com/api/stripe/webhook`
6. Webhook secret-i `.env.local`-a əlavə et

### 6. Lokal İnkişaf

```bash
npm run dev
```

App `http://localhost:3000` ünvanında açılacaq.

### 7. Build & Deploy

```bash
npm run build
npm run start
```

#### Vercel-ə Deploy

1. [vercel.com](https://vercel.com) saytında layihəni import et
2. Environment variable-ları Vercel dashboard-dan əlavə et
3. Deploy et

## Database Migration

Migration faylları `supabase/migrations/` qovluğundadır:

1. `001_initial_schema.sql` - Əsas cədvəllər
2. `002_rls_policies.sql` - RLS siyasətləri
3. `003_seed_plan_limits.sql` - Plan limitləri
4. `004_seed_template_categories.sql` - Şablon kateqoriyaları
5. `005_seed_templates.sql` - Hazır şablonlar

## Admin İstifadəçi Yaratma

Supabase Dashboard > Authentication > Users-dən admin istifadəçi yaradın, sonra SQL Editor-da:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@govmate.ai';
```

## Security Qeydləri

- Bütün cədvəllərdə RLS (Row Level Security) aktiv
- İstifadəçilər yalnız öz sənədlərini görə bilər
- Admin belə sənəd məzmununu default görə bilməz
- Fayl əldə etmə signed URL ilə olur
- Rate limiting tətbiq edilir
- MIME type və fayl ölçüsü yoxlanılır
- Audit log bütün əhəmiyyətli əməliyyatlar üçün saxlanılır

## Lisenziya

Proprietary - Bütün hüquqlar qorunur.
