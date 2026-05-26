-- profiles tablosuna address sütunu ekle (mektup oluşturma formu için gerekli)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
