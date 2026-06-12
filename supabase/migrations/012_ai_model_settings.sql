-- Admin panelden yönetilebilir AI model ayarları
INSERT INTO app_settings (key, value) VALUES
  ('ai_model', 'gpt-4o'),
  ('ai_translation_model', 'gpt-4o-mini')
ON CONFLICT (key) DO NOTHING;
