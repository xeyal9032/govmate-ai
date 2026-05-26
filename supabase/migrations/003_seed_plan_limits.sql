-- Plan limitlerini ekle
INSERT INTO plan_limits (plan, monthly_document_limit, monthly_letter_limit, max_file_size_mb, translation_enabled, reminders_enabled, pdf_export_enabled) VALUES
  ('free', 3, 2, 5, false, false, false),
  ('pro', 50, -1, 25, true, true, true),
  ('business', 500, -1, 100, true, true, true)
ON CONFLICT (plan) DO UPDATE SET
  monthly_document_limit = EXCLUDED.monthly_document_limit,
  monthly_letter_limit = EXCLUDED.monthly_letter_limit,
  max_file_size_mb = EXCLUDED.max_file_size_mb,
  translation_enabled = EXCLUDED.translation_enabled,
  reminders_enabled = EXCLUDED.reminders_enabled,
  pdf_export_enabled = EXCLUDED.pdf_export_enabled;
