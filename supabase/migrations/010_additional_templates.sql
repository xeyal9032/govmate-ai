-- Eksik kategorileri ekle
INSERT INTO template_categories (slug, name, description, icon) VALUES
  ('familienkasse', '{"de":"Familienkasse","tr":"Aile Yardım Kasası","en":"Family Benefits Office","az":"Ailə Müavinəti İdarəsi","ru":"Семейная касса","uk":"Сімейна каса","ar":"صندوق الأسرة"}', '{"de":"Familienkasse Vorlagen","tr":"Aile Yardım Kasası şablonları","en":"Family Benefits Office templates","az":"Ailə Müavinəti İdarəsi şablonları","ru":"Шаблоны семейной кассы","uk":"Шаблони сімейної каси","ar":"قوالب صندوق الأسرة"}', 'baby'),
  ('bamf', '{"de":"BAMF","tr":"BAMF (Göç İdaresi)","en":"BAMF (Migration Office)","az":"BAMF (Miqrasiya İdarəsi)","ru":"BAMF (Миграционная служба)","uk":"BAMF (Міграційна служба)","ar":"المكتب الاتحادي للهجرة"}', '{"de":"BAMF Vorlagen","tr":"BAMF şablonları","en":"BAMF templates","az":"BAMF şablonları","ru":"Шаблоны BAMF","uk":"Шаблони BAMF","ar":"قوالب المكتب الاتحادي للهجرة"}', 'landmark'),
  ('buergeramt', '{"de":"Bürgeramt","tr":"Nüfus Dairesi","en":"Citizens Office","az":"Vətəndaş Xidmətləri","ru":"Бюргерамт","uk":"Бюргерамт","ar":"مكتب المواطنين"}', '{"de":"Bürgeramt Vorlagen","tr":"Nüfus Dairesi şablonları","en":"Citizens Office templates","az":"Vətəndaş Xidmətləri şablonları","ru":"Шаблоны бюргерамта","uk":"Шаблони бюргерамту","ar":"قوالب مكتب المواطنين"}', 'building-2'),
  ('rentenversicherung', '{"de":"Rentenversicherung","tr":"Emekli Sandığı","en":"Pension Insurance","az":"Pensiya Sığortası","ru":"Пенсионное страхование","uk":"Пенсійне страхування","ar":"تأمين المعاشات"}', '{"de":"Rentenversicherung Vorlagen","tr":"Emekli Sandığı şablonları","en":"Pension Insurance templates","az":"Pensiya Sığortası şablonları","ru":"Шаблоны пенсионного страхования","uk":"Шаблони пенсійного страхування","ar":"قوالب تأمين المعاشات"}', 'piggy-bank')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- JOBCENTER - Widerspruch (İtiraz)
-- ============================================
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Widerspruch einlegen',
  'Jobcenter kararına karşı itiraz (Widerspruch) yazısı',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Widerspruch gegen Ihren Bescheid vom {{decision_date}} – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom {{decision_date}}, zugestellt am {{received_date}}, ein.

Begründung meines Widerspruchs:
{{objection_reason}}

Ich bitte Sie, den Bescheid unter Berücksichtigung meines Widerspruchs erneut zu prüfen und mir einen rechtsmittelfähigen Widerspruchsbescheid zuzustellen.

Bis zur Entscheidung über meinen Widerspruch bitte ich darum, die Vollziehung des angefochtenen Bescheids auszusetzen.

Bitte bestätigen Sie den Eingang dieses Widerspruchs schriftlich.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"decision_date","label":"Karar Tarihi","type":"date","required":true},{"key":"received_date","label":"Kararı Aldığınız Tarih","type":"date","required":true},{"key":"objection_reason","label":"İtiraz Gerekçesi","type":"textarea","required":true}]',
  true
);

-- ============================================
-- AUSLÄNDERBEHÖRDE - Widerspruch
-- ============================================
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'auslaenderbehoerde',
  'Widerspruch einlegen',
  'Yabancılar Dairesi kararına karşı itiraz',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Widerspruch gegen Ihren Bescheid vom {{decision_date}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom {{decision_date}}, mir zugestellt am {{received_date}}, ein.

Begründung:
{{objection_reason}}

Ich beantrage, den angefochtenen Bescheid aufzuheben und meinem Anliegen stattzugeben.

Bis zur Entscheidung über meinen Widerspruch bitte ich darum, von aufenthaltsbeendenden Maßnahmen abzusehen und den Status quo aufrechtzuerhalten.

Bitte bestätigen Sie den Eingang dieses Widerspruchs schriftlich.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"decision_date","label":"Karar Tarihi","type":"date","required":true},{"key":"received_date","label":"Kararı Aldığınız Tarih","type":"date","required":true},{"key":"objection_reason","label":"İtiraz Gerekçesi","type":"textarea","required":true}]',
  true
);

-- ============================================
-- VERSICHERUNG ŞABLONLARİ (3 adet)
-- ============================================

-- Versicherung - Schadensmeldung (Hasar bildirimi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'versicherung',
  'Schadensmeldung',
  'Sigorta şirketine hasar bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Versicherung]

{{date}}

Betreff: Schadensmeldung – Versicherungsnummer {{policy_number}}

Sehr geehrte Damen und Herren,

hiermit melde ich folgenden Schaden, der am {{damage_date}} eingetreten ist:

Schadenbeschreibung:
{{damage_description}}

Schadenort: {{damage_location}}

{{additional_info}}

Ich bitte Sie, den Schaden zu prüfen und mir die weiteren Schritte zur Schadensregulierung mitzuteilen.

Entsprechende Belege und Nachweise füge ich diesem Schreiben bei.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Sigorta Şirketi","type":"text","required":true},{"key":"policy_number","label":"Poliçe Numarası","type":"text","required":true},{"key":"damage_date","label":"Hasar Tarihi","type":"date","required":true},{"key":"damage_description","label":"Hasar Açıklaması","type":"textarea","required":true},{"key":"damage_location","label":"Hasar Yeri","type":"text","required":true},{"key":"additional_info","label":"Ek Bilgiler","type":"textarea","required":false}]',
  true
);

-- Versicherung - Kündigung (Sigorta feshi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'versicherung',
  'Kündigung der Versicherung',
  'Sigorta sözleşmesinin fesih bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Versicherung]

{{date}}

Betreff: Kündigung meiner Versicherung – Versicherungsnummer {{policy_number}}

Sehr geehrte Damen und Herren,

hiermit kündige ich meinen Versicherungsvertrag mit der Versicherungsnummer {{policy_number}} fristgerecht zum {{termination_date}}.

{{reason}}

Ich bitte Sie, mir die Kündigung schriftlich zu bestätigen und eventuell zu viel gezahlte Beiträge auf folgendes Konto zurückzuerstatten.

Bitte senden Sie die Bestätigung an die oben genannte Adresse.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Sigorta Şirketi","type":"text","required":true},{"key":"policy_number","label":"Poliçe Numarası","type":"text","required":true},{"key":"termination_date","label":"Fesih Tarihi","type":"date","required":true},{"key":"reason","label":"Fesih Nedeni (Opsiyonel)","type":"textarea","required":false}]',
  true
);

-- Versicherung - Vertragsänderung (Sözleşme değişikliği)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'versicherung',
  'Vertragsänderung mitteilen',
  'Sigorta sözleşmesinde değişiklik bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Versicherung]

{{date}}

Betreff: Änderung meiner Versicherungsdaten – Versicherungsnummer {{policy_number}}

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen folgende Änderung meiner Versicherungsdaten mit:

{{change_details}}

Diese Änderung ist gültig ab dem {{change_date}}.

Ich bitte Sie, die Änderung in meinem Vertrag zu berücksichtigen und mir eine aktualisierte Bestätigung zuzusenden.

Für Rückfragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Sigorta Şirketi","type":"text","required":true},{"key":"policy_number","label":"Poliçe Numarası","type":"text","required":true},{"key":"change_details","label":"Değişiklik Detayları","type":"textarea","required":true},{"key":"change_date","label":"Değişiklik Tarihi","type":"date","required":true}]',
  true
);

-- ============================================
-- SCHULE/KITA ŞABLONLARİ (3 adet)
-- ============================================

-- Schule - Krankmeldung (Hastalık bildirimi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'schule',
  'Krankmeldung für das Kind',
  'Çocuğun hastalığı nedeniyle okula/kreşe devamsızlık bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}

{{date}}

Betreff: Krankmeldung für {{child_name}}, Klasse/Gruppe {{class_name}}

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen mit, dass mein Kind {{child_name}} aufgrund von Krankheit ab dem {{absence_start}} leider nicht am Unterricht/an der Betreuung teilnehmen kann.

Voraussichtlich wird mein Kind am {{expected_return}} wieder am Unterricht/an der Betreuung teilnehmen können.

{{additional_info}}

Bei Rückfragen erreichen Sie mich unter der oben genannten Adresse.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad (Veli)","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Okul/Kreş Adı","type":"text","required":true},{"key":"child_name","label":"Çocuğun Adı Soyadı","type":"text","required":true},{"key":"class_name","label":"Sınıf/Grup","type":"text","required":true},{"key":"absence_start","label":"Devamsızlık Başlangıcı","type":"date","required":true},{"key":"expected_return","label":"Tahmini Dönüş Tarihi","type":"date","required":false},{"key":"additional_info","label":"Ek Bilgiler","type":"textarea","required":false}]',
  true
);

-- Schule - Beurlaubung (İzin talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'schule',
  'Beurlaubung beantragen',
  'Çocuk için okul/kreş izin talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}

{{date}}

Betreff: Antrag auf Beurlaubung für {{child_name}}, Klasse/Gruppe {{class_name}}

Sehr geehrte Damen und Herren,

hiermit beantrage ich die Beurlaubung meines Kindes {{child_name}} vom {{leave_start}} bis zum {{leave_end}}.

Grund der Beurlaubung:
{{reason}}

Ich versichere, dass mein Kind den versäumten Unterrichtsstoff nachholen wird.

Ich bitte Sie um eine schriftliche Bestätigung meines Antrags.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad (Veli)","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Okul/Kreş Adı","type":"text","required":true},{"key":"child_name","label":"Çocuğun Adı Soyadı","type":"text","required":true},{"key":"class_name","label":"Sınıf/Grup","type":"text","required":true},{"key":"leave_start","label":"İzin Başlangıcı","type":"date","required":true},{"key":"leave_end","label":"İzin Bitişi","type":"date","required":true},{"key":"reason","label":"İzin Nedeni","type":"textarea","required":true}]',
  true
);

-- Schule - Schulanmeldung (Okul kaydı)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'schule',
  'Schulanmeldung',
  'Çocuğun okula kaydı için başvuru mektubu',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}

{{date}}

Betreff: Anmeldung meines Kindes {{child_name}} – {{subject}}

Sehr geehrte Damen und Herren,

hiermit möchte ich mein Kind {{child_name}}, geboren am {{child_birthdate}}, für das Schuljahr {{school_year}} an Ihrer Schule anmelden.

Wir sind seit dem {{move_in_date}} unter der oben genannten Adresse wohnhaft.

Bisherige Schule: {{previous_school}}

Besondere Hinweise:
{{additional_info}}

Ich bitte um Mitteilung, welche Unterlagen für die Anmeldung erforderlich sind und wann ein Aufnahmegespräch stattfinden kann.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad (Veli)","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Okul Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"child_name","label":"Çocuğun Adı Soyadı","type":"text","required":true},{"key":"child_birthdate","label":"Çocuğun Doğum Tarihi","type":"date","required":true},{"key":"school_year","label":"Öğretim Yılı","type":"text","required":true},{"key":"move_in_date","label":"Taşınma Tarihi","type":"date","required":false},{"key":"previous_school","label":"Önceki Okul","type":"text","required":false},{"key":"additional_info","label":"Ek Bilgiler","type":"textarea","required":false}]',
  true
);

-- ============================================
-- FAMILIENKASSE ŞABLONLARİ (3 adet)
-- ============================================

-- Familienkasse - Kindergeld Antrag
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'familienkasse',
  'Kindergeld-Antrag begleiten',
  'Kindergeld başvurusuna eklenecek kapak yazısı',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Familienkasse]

{{date}}

Betreff: Antrag auf Kindergeld für {{child_name}}
Kindergeld-Nr.: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit beantrage ich Kindergeld für mein Kind:

Name des Kindes: {{child_name}}
Geburtsdatum: {{child_birthdate}}
Staatsangehörigkeit: {{nationality}}

Das ausgefüllte Antragsformular sowie folgende Unterlagen sind diesem Schreiben beigefügt:

{{document_list}}

Ich bitte um zeitnahe Bearbeitung meines Antrags. Für Rückfragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Kindergeld Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"child_name","label":"Çocuğun Adı Soyadı","type":"text","required":true},{"key":"child_birthdate","label":"Çocuğun Doğum Tarihi","type":"date","required":true},{"key":"nationality","label":"Uyruk","type":"text","required":true},{"key":"document_list","label":"Eklenen Belgeler","type":"textarea","required":true}]',
  true
);

-- Familienkasse - Veränderungsmitteilung
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'familienkasse',
  'Veränderungsmitteilung',
  'Aile yardımı ile ilgili değişiklik bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Familienkasse]

{{date}}

Betreff: Veränderungsmitteilung – Kindergeld-Nr. {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen folgende Änderung mit, die mein Kindergeld betrifft:

{{change_details}}

Diese Änderung gilt ab dem {{change_date}}.

Entsprechende Nachweise füge ich diesem Schreiben bei. Ich bitte Sie, meine Daten entsprechend anzupassen.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Kindergeld Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"change_details","label":"Değişiklik Detayları","type":"textarea","required":true},{"key":"change_date","label":"Değişiklik Tarihi","type":"date","required":true}]',
  true
);

-- Familienkasse - Widerspruch
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'familienkasse',
  'Widerspruch einlegen',
  'Familienkasse kararına itiraz',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Familienkasse]

{{date}}

Betreff: Widerspruch gegen Ihren Bescheid vom {{decision_date}}
Kindergeld-Nr.: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom {{decision_date}}, zugestellt am {{received_date}}, ein.

Begründung:
{{objection_reason}}

Ich bitte Sie, den Bescheid erneut zu prüfen und mir einen rechtsmittelfähigen Widerspruchsbescheid zuzustellen.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Kindergeld Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"decision_date","label":"Karar Tarihi","type":"date","required":true},{"key":"received_date","label":"Kararı Aldığınız Tarih","type":"date","required":true},{"key":"objection_reason","label":"İtiraz Gerekçesi","type":"textarea","required":true}]',
  true
);

-- ============================================
-- BAMF ŞABLONLARİ (2 adet)
-- ============================================

-- BAMF - Terminanfrage
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'bamf',
  'Terminanfrage',
  'BAMF''den randevu talebi',
  'de',
  '{{full_name}}
{{address}}

Bundesamt für Migration und Flüchtlinge (BAMF)
{{authority_name}}

{{date}}

Betreff: Terminanfrage – {{subject}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich um einen Termin bei Ihrem Amt für folgenden Anlass:

{{appointment_purpose}}

Meine persönlichen Daten:
- Name: {{full_name}}
- Aktenzeichen: {{customer_number}}
- Staatsangehörigkeit: {{nationality}}

Ich bitte um zeitnahe Terminvergabe und stehe für Rückfragen zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"BAMF Şubesi","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"nationality","label":"Uyruk","type":"text","required":true},{"key":"appointment_purpose","label":"Randevu Amacı","type":"textarea","required":true}]',
  true
);

-- BAMF - Sachstandsanfrage
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'bamf',
  'Sachstandsanfrage',
  'BAMF''deki başvuru durumu hakkında sorgulama',
  'de',
  '{{full_name}}
{{address}}

Bundesamt für Migration und Flüchtlinge (BAMF)
{{authority_name}}

{{date}}

Betreff: Sachstandsanfrage zu meinem Verfahren
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

am {{application_date}} habe ich bei Ihnen einen Antrag gestellt. Seitdem sind {{weeks_passed}} Wochen vergangen, und ich habe leider noch keine Rückmeldung erhalten.

Ich bitte Sie höflich, mich über den aktuellen Bearbeitungsstand meines Verfahrens zu informieren.

Meine Daten:
- Name: {{full_name}}
- Aktenzeichen: {{customer_number}}
- Staatsangehörigkeit: {{nationality}}

Vielen Dank für Ihre Bemühungen.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"BAMF Şubesi","type":"text","required":true},{"key":"nationality","label":"Uyruk","type":"text","required":true},{"key":"application_date","label":"Başvuru Tarihi","type":"date","required":true},{"key":"weeks_passed","label":"Geçen Süre (Hafta)","type":"text","required":true}]',
  true
);

-- ============================================
-- BÜRGERAMT ŞABLONLARİ (2 adet)
-- ============================================

-- Bürgeramt - Ummeldung
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'buergeramt',
  'Ummeldung mitteilen',
  'Adres değişikliğinin nüfus dairesine bildirilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Bürgeramts]

{{date}}

Betreff: Ummeldung – Neue Anschrift

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen mit, dass ich am {{move_date}} von meiner bisherigen Adresse in eine neue Wohnung umgezogen bin.

Bisherige Anschrift:
{{old_address}}

Neue Anschrift (gültig ab {{move_date}}):
{{new_address}}

Folgende Personen sind mitumgezogen:
{{family_members}}

Ich bitte um die Ummeldung an meinem neuen Wohnort und die Zusendung einer aktualisierten Meldebescheinigung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Yeni Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"move_date","label":"Taşınma Tarihi","type":"date","required":true},{"key":"old_address","label":"Eski Adres","type":"textarea","required":true},{"key":"new_address","label":"Yeni Adres","type":"textarea","required":true},{"key":"family_members","label":"Birlikte Taşınan Kişiler","type":"textarea","required":false}]',
  true
);

-- Bürgeramt - Abmeldung
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'buergeramt',
  'Abmeldung bei Wegzug ins Ausland',
  'Yurt dışına taşınma durumunda nüfus kayıt silme bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Bürgeramts]

{{date}}

Betreff: Abmeldung wegen Wegzugs ins Ausland

Sehr geehrte Damen und Herren,

hiermit melde ich mich zum {{departure_date}} von meiner derzeitigen Anschrift ab, da ich ins Ausland umziehe.

Bisherige Anschrift:
{{address}}

Zielland: {{destination_country}}

Ich bitte um eine Abmeldebestätigung an die oben genannte Adresse oder per E-Mail an: {{email}}

Vielen Dank für Ihre Bearbeitung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Mevcut Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"departure_date","label":"Ayrılış Tarihi","type":"date","required":true},{"key":"destination_country","label":"Hedef Ülke","type":"text","required":true},{"key":"email","label":"E-Posta Adresi","type":"text","required":false}]',
  true
);

-- ============================================
-- RENTENVERSICHERUNG ŞABLONLARİ (2 adet)
-- ============================================

-- Rentenversicherung - Kontoklärung anfragen
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'rentenversicherung',
  'Kontoklärung anfragen',
  'Emeklilik hesabı açıklama talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Deutschen Rentenversicherung]

{{date}}

Betreff: Antrag auf Kontoklärung
Versicherungsnummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich um eine Kontoklärung meines Rentenversicherungskontos. Ich möchte sicherstellen, dass alle Versicherungszeiten vollständig und korrekt erfasst sind.

Insbesondere bitte ich um Prüfung folgender Zeiten:
{{periods_to_check}}

Meine persönlichen Daten:
- Name: {{full_name}}
- Versicherungsnummer: {{customer_number}}
- Geburtsdatum: {{birth_date}}

Bitte senden Sie mir einen aktuellen Versicherungsverlauf zu.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Sigorta Numarası","type":"text","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"birth_date","label":"Doğum Tarihi","type":"date","required":true},{"key":"periods_to_check","label":"Kontrol Edilecek Dönemler","type":"textarea","required":true}]',
  true
);

-- Rentenversicherung - Versicherungsverlauf anfordern
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'rentenversicherung',
  'Versicherungsverlauf anfordern',
  'Emeklilik sigorta geçmişi talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Deutschen Rentenversicherung]

{{date}}

Betreff: Anforderung meines Versicherungsverlaufs
Versicherungsnummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich Sie um Zusendung meines aktuellen Versicherungsverlaufs.

Meine persönlichen Daten:
- Name: {{full_name}}
- Versicherungsnummer: {{customer_number}}
- Geburtsdatum: {{birth_date}}

Bitte senden Sie den Verlauf an meine oben genannte Adresse.

Vielen Dank für Ihre Bearbeitung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Sigorta Numarası","type":"text","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"birth_date","label":"Doğum Tarihi","type":"date","required":true}]',
  true
);

-- ============================================
-- ALLGEMEIN - Widerspruch (Genel itiraz)
-- ============================================
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'allgemein',
  'Allgemeiner Widerspruch',
  'Herhangi bir kuruma genel itiraz mektubu',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Widerspruch gegen Ihren Bescheid vom {{decision_date}} – {{subject}}
Aktenzeichen/Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom {{decision_date}}, mir zugestellt am {{received_date}}, ein.

Begründung meines Widerspruchs:
{{objection_reason}}

Ich bitte Sie, den angefochtenen Bescheid unter Berücksichtigung meiner Begründung erneut zu überprüfen.

Bitte bestätigen Sie den Eingang dieses Widerspruchs schriftlich.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Dosya/Müşteri Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"decision_date","label":"Karar Tarihi","type":"date","required":true},{"key":"received_date","label":"Kararı Aldığınız Tarih","type":"date","required":true},{"key":"objection_reason","label":"İtiraz Gerekçesi","type":"textarea","required":true}]',
  true
);

-- ============================================
-- ALLGEMEIN - Vollmacht (Vekaletname)
-- ============================================
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'allgemein',
  'Vollmacht erteilen',
  'Başka bir kişiye resmi işlemler için yetki verme belgesi',
  'de',
  '{{full_name}}
{{address}}

{{date}}

Vollmacht

Hiermit bevollmächtige ich

Name: {{authorized_person}}
Adresse: {{authorized_address}}

mich in folgender Angelegenheit zu vertreten:

{{authorization_scope}}

Die Vollmacht gilt gegenüber: {{authority_name}}
Aktenzeichen/Kundennummer: {{customer_number}}

Diese Vollmacht ist gültig {{validity}}.

Der/die Bevollmächtigte ist berechtigt, in meinem Namen Anträge zu stellen, Unterlagen einzureichen und entgegenzunehmen sowie Auskünfte einzuholen.

{{full_name}}
(Unterschrift des Vollmachtgebers)

{{date}}',
  '[{"key":"full_name","label":"Ad Soyad (Vekalet Veren)","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authorized_person","label":"Yetkili Kişi Adı","type":"text","required":true},{"key":"authorized_address","label":"Yetkili Kişi Adresi","type":"textarea","required":true},{"key":"authorization_scope","label":"Yetki Kapsamı","type":"textarea","required":true},{"key":"authority_name","label":"İlgili Kurum","type":"text","required":true},{"key":"customer_number","label":"Dosya/Müşteri Numarası","type":"text","required":false},{"key":"validity","label":"Geçerlilik Süresi","type":"text","required":true}]',
  true
);
