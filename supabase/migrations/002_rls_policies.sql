-- RLS politikaları

-- Admin kontrol fonksiyonu (SECURITY DEFINER ile RLS döngüsünü kırar)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiller
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profilini okuyabilir"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Adminler tüm profilleri okuyabilir"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Abonelikler
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi aboneliğini okuyabilir"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi aboneliğini güncelleyebilir"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Belgeler
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi belgelerini okuyabilir"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar belge yükleyebilir"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi belgelerini güncelleyebilir"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi belgelerini silebilir"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Belge analizleri
ALTER TABLE document_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi analizlerini okuyabilir"
  ON document_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar analiz oluşturabilir"
  ON document_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Son tarihler
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi son tarihlerini okuyabilir"
  ON deadlines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar son tarih ekleyebilir"
  ON deadlines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi son tarihlerini güncelleyebilir"
  ON deadlines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi son tarihlerini silebilir"
  ON deadlines FOR DELETE
  USING (auth.uid() = user_id);

-- Oluşturulan mektuplar
ALTER TABLE generated_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi mektuplarını okuyabilir"
  ON generated_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar mektup oluşturabilir"
  ON generated_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi mektuplarını güncelleyebilir"
  ON generated_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi mektuplarını silebilir"
  ON generated_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Şablonlar (herkes okuyabilir, admin yazabilir)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes aktif şablonları okuyabilir"
  ON templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Adminler tüm şablonları okuyabilir"
  ON templates FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler şablon oluşturabilir"
  ON templates FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler şablon güncelleyebilir"
  ON templates FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler şablon silebilir"
  ON templates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Şablon kategorileri (herkes okuyabilir, admin yazabilir)
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes kategorileri okuyabilir"
  ON template_categories FOR SELECT
  USING (true);

CREATE POLICY "Adminler kategori oluşturabilir"
  ON template_categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler kategori güncelleyebilir"
  ON template_categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler kategori silebilir"
  ON template_categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Plan limitleri (herkes okuyabilir)
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes plan limitlerini okuyabilir"
  ON plan_limits FOR SELECT
  USING (true);

CREATE POLICY "Adminler plan limitlerini güncelleyebilir"
  ON plan_limits FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Kullanım logları
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi kullanım loglarını okuyabilir"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanım logu oluşturulabilir"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Denetim logları (sadece admin)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adminler denetim loglarını okuyabilir"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Geri bildirimler
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar geri bildirim gönderebilir"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi geri bildirimlerini okuyabilir"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Adminler tüm geri bildirimleri okuyabilir"
  ON feedback FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Adminler geri bildirim durumunu güncelleyebilir"
  ON feedback FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Denetim logu oluşturma (server-side)
CREATE POLICY "Audit log oluşturulabilir"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Destek izinleri
ALTER TABLE support_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi izinlerini yönetebilir"
  ON support_permissions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Destek personeli kendisine verilen izinleri okuyabilir"
  ON support_permissions FOR SELECT
  USING (auth.uid() = granted_to);

-- Storage politikaları
CREATE POLICY "Kullanıcılar kendi dosyalarını yükleyebilir"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Kullanıcılar kendi dosyalarını okuyabilir"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Kullanıcılar kendi dosyalarını silebilir"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
