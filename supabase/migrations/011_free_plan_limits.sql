-- Ücretsiz plan: daha cömert limitler (20 belge/ay, 20 MB dosya)
UPDATE plan_limits
SET
  monthly_document_limit = 20,
  max_file_size_mb = 20
WHERE plan = 'free';
