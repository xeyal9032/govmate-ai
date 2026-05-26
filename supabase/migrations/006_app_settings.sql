-- Uygulama ayarları tablosu (AI promptları, sistem ayarları, feature flags, bakım modu)
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes ayarları okuyabilir"
  ON app_settings FOR SELECT
  USING (true);

CREATE POLICY "Adminler ayarları güncelleyebilir"
  ON app_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Varsayılan AI prompt'ları ekle
INSERT INTO app_settings (key, value) VALUES
  ('ai_system_prompt', 'You are an AI assistant helping immigrants in Germany understand official letters. You are NOT a lawyer and must never provide legal advice.

Your task:
1. Analyze the provided document text
2. Identify the type of document and the sending authority
3. Extract all deadlines and important dates
4. Explain the document in simple, easy-to-understand language
5. List required actions the recipient needs to take
6. List any documents the recipient needs to prepare
7. Identify risks if the letter is ignored
8. Suggest an appropriate response type

Rules:
- NEVER invent facts or deadlines that are not in the document
- If something is unclear, explicitly state it is unclear
- NEVER provide definitive legal opinions
- Always include a legal disclaimer
- Return confidence score based on how clearly you could read and understand the document
- All explanations must be in the user''s preferred language
- The original German text should be preserved separately'),
  ('ai_disclaimer', 'Bu uygulama yapay zeka destekli bir bilgi aracıdır ve profesyonel hukuki danışmanlık yerine geçmez. Oluşturulan belgeler, mektuplar ve analizler yalnızca bilgilendirme amaçlıdır. Hukuki kararlarınız için mutlaka bir avukata danışmanızı öneririz.'),
  ('maintenance_mode', 'false'),
  ('feature_translation', 'true'),
  ('feature_pdf_export', 'true'),
  ('feature_reminders', 'true')
ON CONFLICT (key) DO NOTHING;

-- Feedback tablosuna admin yanıtı alanı ekle
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS replied_by UUID REFERENCES profiles(id);

-- Site içeriği tablosu (legal, pricing, FAQ vb.)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('legal', 'pricing', 'faq', 'page')),
  title JSONB NOT NULL DEFAULT '{}',
  body JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes yayınlanmış içeriği okuyabilir"
  ON site_content FOR SELECT
  USING (is_published = true);

CREATE POLICY "Adminler tüm içeriği yönetebilir"
  ON site_content FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Varsayılan legal içerik ekle
INSERT INTO site_content (slug, content_type, title, body, sort_order) VALUES
  ('disclaimer', 'legal', '{"de":"Haftungsausschluss","tr":"Sorumluluk Reddi","en":"Disclaimer"}', '{"de":"GovMate AI ist ein KI-gestütztes Informationstool und kein Ersatz für professionelle Rechtsberatung.","tr":"GovMate AI yapay zeka destekli bir bilgi aracıdır ve profesyonel hukuki danışmanlık yerine geçmez.","en":"GovMate AI is an AI-powered information tool and does not replace professional legal advice."}', 1),
  ('privacy', 'legal', '{"de":"Datenschutz","tr":"Gizlilik Politikası","en":"Privacy Policy"}', '{"de":"Ihre Daten werden gemäß DSGVO verarbeitet.","tr":"Verileriniz KVKK kapsamında işlenir.","en":"Your data is processed in accordance with GDPR."}', 2),
  ('terms', 'legal', '{"de":"Nutzungsbedingungen","tr":"Kullanım Şartları","en":"Terms of Service"}', '{"de":"Mit der Nutzung von GovMate AI stimmen Sie diesen Bedingungen zu.","tr":"GovMate AI kullanarak bu şartları kabul edersiniz.","en":"By using GovMate AI you agree to these terms."}', 3)
ON CONFLICT (slug) DO NOTHING;
