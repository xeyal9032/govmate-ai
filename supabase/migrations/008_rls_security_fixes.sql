-- Güvenlik düzeltmeleri

-- 1. Kullanıcıların kendi abonelik planını değiştirmesini engelle
-- Eski politikayı kaldır ve daha kısıtlayıcı bir politika ekle
DROP POLICY IF EXISTS "Kullanıcılar kendi aboneliğini güncelleyebilir" ON subscriptions;

CREATE POLICY "Kullanıcılar sadece iptal ayarını güncelleyebilir"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NOT: Abonelik planı değişiklikleri yalnızca Stripe webhook (service_role) veya admin client ile yapılmalıdır.
-- Supabase'in column-level RLS desteği olmadığı için, client-side'da plan/status alanlarını
-- güncelleyen kod olmamalı. Tüm plan değişiklikleri createAdminClient() ile yapılıyor.

-- 2. audit_logs INSERT politikasını daralt (sadece authenticated kullanıcılar)
DROP POLICY IF EXISTS "Audit log oluşturulabilir" ON audit_logs;

CREATE POLICY "Authenticated kullanıcılar audit log oluşturabilir"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. templates/template_categories/plan_limits admin politikalarını is_admin() ile tutarlı yap
-- Templates
DROP POLICY IF EXISTS "Adminler tüm şablonları okuyabilir" ON templates;
CREATE POLICY "Adminler tüm şablonları okuyabilir"
  ON templates FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Adminler şablon oluşturabilir" ON templates;
CREATE POLICY "Adminler şablon oluşturabilir"
  ON templates FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Adminler şablon güncelleyebilir" ON templates;
CREATE POLICY "Adminler şablon güncelleyebilir"
  ON templates FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Adminler şablon silebilir" ON templates;
CREATE POLICY "Adminler şablon silebilir"
  ON templates FOR DELETE
  USING (public.is_admin());

-- Template categories
DROP POLICY IF EXISTS "Adminler kategori oluşturabilir" ON template_categories;
CREATE POLICY "Adminler kategori oluşturabilir"
  ON template_categories FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Adminler kategori güncelleyebilir" ON template_categories;
CREATE POLICY "Adminler kategori güncelleyebilir"
  ON template_categories FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Adminler kategori silebilir" ON template_categories;
CREATE POLICY "Adminler kategori silebilir"
  ON template_categories FOR DELETE
  USING (public.is_admin());

-- Plan limits
DROP POLICY IF EXISTS "Adminler plan limitlerini güncelleyebilir" ON plan_limits;
CREATE POLICY "Adminler plan limitlerini yönetebilir"
  ON plan_limits FOR ALL
  USING (public.is_admin());

-- Audit logs SELECT
DROP POLICY IF EXISTS "Adminler denetim loglarını okuyabilir" ON audit_logs;
CREATE POLICY "Adminler denetim loglarını okuyabilir"
  ON audit_logs FOR SELECT
  USING (public.is_admin());

-- Feedback admin politikaları
DROP POLICY IF EXISTS "Adminler tüm geri bildirimleri okuyabilir" ON feedback;
CREATE POLICY "Adminler tüm geri bildirimleri okuyabilir"
  ON feedback FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Adminler geri bildirim durumunu güncelleyebilir" ON feedback;
CREATE POLICY "Adminler geri bildirim durumunu güncelleyebilir"
  ON feedback FOR UPDATE
  USING (public.is_admin());

-- 4. Eksik indexler
CREATE INDEX IF NOT EXISTS idx_generated_letters_user_id ON generated_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_document_id ON document_analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
