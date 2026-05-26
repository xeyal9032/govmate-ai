-- 20 hazır Almanca resmi mektup şablonu

-- Ortak değişkenler JSON tanımı
-- Her şablonda aynı variables kullanılıyor

-- ============================================
-- JOBCENTER ŞABLONLARİ (5 adet)
-- ============================================

-- 1. Jobcenter - Unterlagen nachreichen (Ek belge gönderme)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Unterlagen nachreichen',
  'Jobcenter tarafından istenen ek belgelerin gönderilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Nachreichung von Unterlagen – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

in Bezug auf Ihr Schreiben vom {{reference_date}} reiche ich hiermit die angeforderten Unterlagen nach.

Folgende Dokumente sind diesem Schreiben beigefügt:

{{document_list}}

Ich bitte Sie, die eingereichten Unterlagen zu prüfen und meinen Antrag entsprechend weiterzubearbeiten. Sollten weitere Unterlagen erforderlich sein, stehe ich Ihnen gerne zur Verfügung.

Für Rückfragen erreichen Sie mich unter der oben genannten Adresse.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"reference_date","label":"Referans Yazı Tarihi","type":"date","required":false},{"key":"document_list","label":"Eklenen Belgeler","type":"textarea","required":true}]',
  true
);

-- 2. Jobcenter - Fristverlängerung beantragen (Süre uzatma talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Fristverlängerung beantragen',
  'Jobcenter tarafından verilen sürenin uzatılması talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Antrag auf Fristverlängerung – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich um eine Verlängerung der mir gesetzten Frist vom {{original_deadline}}.

Grund für meinen Antrag:
{{reason}}

Ich bemühe mich, die erforderlichen Unterlagen bzw. Informationen so schnell wie möglich bereitzustellen. Ich bitte Sie höflich, mir eine Fristverlängerung bis zum {{requested_deadline}} zu gewähren.

Für Rückfragen stehe ich Ihnen selbstverständlich zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"original_deadline","label":"Mevcut Son Tarih","type":"date","required":true},{"key":"requested_deadline","label":"Talep Edilen Yeni Tarih","type":"date","required":true},{"key":"reason","label":"Uzatma Nedeni","type":"textarea","required":true}]',
  true
);

-- 3. Jobcenter - Termin verschieben (Randevu değiştirme)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Termin verschieben',
  'Jobcenter randevusunun başka bir tarihe ertelenmesi talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Bitte um Terminverschiebung – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

ich habe für den {{appointment_date}} um {{appointment_time}} Uhr einen Termin bei Ihnen. Leider bin ich aus folgendem Grund verhindert:

{{reason}}

Ich bitte Sie höflich, mir einen neuen Termin zuzuweisen. Falls möglich, wäre mir ein Termin ab dem {{preferred_date}} am besten gelegen.

Ich entschuldige mich für die Unannehmlichkeiten und danke Ihnen im Voraus für Ihr Verständnis.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"appointment_date","label":"Mevcut Randevu Tarihi","type":"date","required":true},{"key":"appointment_time","label":"Mevcut Randevu Saati","type":"text","required":true},{"key":"preferred_date","label":"Tercih Edilen Yeni Tarih","type":"date","required":false},{"key":"reason","label":"Erteleme Nedeni","type":"textarea","required":true}]',
  true
);

-- 4. Jobcenter - Veränderungsmitteilung (Değişiklik bildirimi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Veränderungsmitteilung',
  'Kişisel bilgilerdeki değişikliklerin Jobcenter''e bildirilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Veränderungsmitteilung – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen folgende Änderung meiner persönlichen Verhältnisse mit, die ab dem {{change_date}} wirksam ist:

{{change_details}}

Entsprechende Nachweise sind diesem Schreiben beigefügt. Ich bitte Sie, diese Änderung in meinen Unterlagen zu berücksichtigen und meine Leistungen entsprechend anzupassen.

Sollten Sie weitere Informationen oder Unterlagen benötigen, stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"change_date","label":"Değişiklik Tarihi","type":"date","required":true},{"key":"change_details","label":"Değişiklik Detayları","type":"textarea","required":true}]',
  true
);

-- 5. Jobcenter - Nachfrage zum Bescheid (Karar hakkında soru)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'jobcenter',
  'Nachfrage zum Bescheid',
  'Jobcenter kararı hakkında açıklama talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Nachfrage zu Ihrem Bescheid vom {{decision_date}} – {{subject}}
Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

ich habe Ihren Bescheid vom {{decision_date}} erhalten. Leider sind mir einige Punkte unklar, zu denen ich gerne eine Erläuterung hätte:

{{questions}}

Ich bitte Sie höflich, mir die genannten Punkte schriftlich zu erklären, damit ich den Bescheid vollständig nachvollziehen kann.

Bitte beachten Sie, dass diese Nachfrage keinen Widerspruch darstellt. Ich behalte mir jedoch vor, nach Erhalt Ihrer Erläuterung gegebenenfalls Widerspruch einzulegen.

Vielen Dank für Ihre Bemühungen.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"decision_date","label":"Karar Tarihi","type":"date","required":true},{"key":"questions","label":"Sorularınız","type":"textarea","required":true}]',
  true
);

-- ============================================
-- AUSLÄNDERBEHÖRDE ŞABLONLARİ (4 adet)
-- ============================================

-- 6. Ausländerbehörde - Termin anfragen (Randevu talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'auslaenderbehoerde',
  'Termin anfragen',
  'Yabancılar Dairesi''nden randevu talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Terminanfrage – {{subject}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich um einen Termin bei der Ausländerbehörde für folgenden Anlass:

{{appointment_purpose}}

Meine aktuelle Aufenthaltserlaubnis ist gültig bis zum {{permit_expiry_date}}. Um eine rechtzeitige Bearbeitung sicherzustellen, bitte ich Sie, mir möglichst zeitnah einen Termin zuzuweisen.

Folgende Unterlagen werde ich zum Termin mitbringen:
{{document_list}}

Für Rückfragen stehe ich Ihnen unter der oben genannten Adresse zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"appointment_purpose","label":"Randevu Amacı","type":"textarea","required":true},{"key":"permit_expiry_date","label":"İzin Son Geçerlilik Tarihi","type":"date","required":false},{"key":"document_list","label":"Getirilecek Belgeler","type":"textarea","required":false}]',
  true
);

-- 7. Ausländerbehörde - Aufenthaltstitel Abholung nachfragen (Oturma izni teslim alma sorgusu)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'auslaenderbehoerde',
  'Aufenthaltstitel Abholung nachfragen',
  'Hazırlanan oturma izni belgesinin teslim alınması hakkında sorgulama',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Nachfrage zur Abholung meines Aufenthaltstitels – {{subject}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

am {{application_date}} habe ich bei Ihnen einen Antrag auf Erteilung/Verlängerung meines Aufenthaltstitels gestellt. Seitdem habe ich leider keine Benachrichtigung über die Fertigstellung erhalten.

Ich möchte höflich anfragen, ob mein Aufenthaltstitel bereits zur Abholung bereitliegt und ob ich dafür einen Termin benötige.

Meine Daten:
- Name: {{full_name}}
- Geburtsdatum: {{birth_date}}
- Staatsangehörigkeit: {{nationality}}
- Aktenzeichen: {{customer_number}}

Ich danke Ihnen im Voraus für Ihre Rückmeldung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"application_date","label":"Başvuru Tarihi","type":"date","required":true},{"key":"birth_date","label":"Doğum Tarihi","type":"date","required":true},{"key":"nationality","label":"Uyruk","type":"text","required":true}]',
  true
);

-- 8. Ausländerbehörde - Fristverlängerung bitten (Süre uzatma ricası)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'auslaenderbehoerde',
  'Fristverlängerung bitten',
  'Yabancılar Dairesi belge teslim süresinin uzatılması ricası',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Bitte um Fristverlängerung zur Einreichung von Unterlagen – {{subject}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

mit Ihrem Schreiben vom {{letter_date}} haben Sie mich aufgefordert, bis zum {{original_deadline}} folgende Unterlagen einzureichen:

{{required_documents}}

Leider ist es mir aus folgendem Grund nicht möglich, diese Frist einzuhalten:

{{reason}}

Ich bitte Sie daher höflich um eine Verlängerung der Frist bis zum {{requested_deadline}}. Ich versichere Ihnen, dass ich die Unterlagen so schnell wie möglich nachreichen werde.

Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"letter_date","label":"Yazı Tarihi","type":"date","required":true},{"key":"original_deadline","label":"Mevcut Son Tarih","type":"date","required":true},{"key":"requested_deadline","label":"Talep Edilen Yeni Tarih","type":"date","required":true},{"key":"required_documents","label":"İstenen Belgeler","type":"textarea","required":true},{"key":"reason","label":"Gecikme Nedeni","type":"textarea","required":true}]',
  true
);

-- 9. Ausländerbehörde - Dokumente nachreichen (Ek belge gönderme)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'auslaenderbehoerde',
  'Dokumente nachreichen',
  'Yabancılar Dairesi''ne ek belge gönderme',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde]

{{date}}

Betreff: Nachreichung angeforderter Unterlagen – {{subject}}
Aktenzeichen: {{customer_number}}

Sehr geehrte Damen und Herren,

in Bezug auf Ihr Schreiben vom {{letter_date}} bzw. die Aufforderung bei meinem letzten Termin reiche ich hiermit die angeforderten Unterlagen nach:

{{document_list}}

Ich bitte Sie, meine Unterlagen zu prüfen und den Vorgang entsprechend weiterzubearbeiten. Sollten darüber hinaus noch weitere Dokumente benötigt werden, teilen Sie mir dies bitte rechtzeitig mit.

Vielen Dank für Ihre Bearbeitung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"letter_date","label":"Referans Yazı Tarihi","type":"date","required":false},{"key":"document_list","label":"Eklenen Belgeler","type":"textarea","required":true}]',
  true
);

-- ============================================
-- KRANKENKASSE ŞABLONLARİ (3 adet)
-- ============================================

-- 10. Krankenkasse - Mitgliedsbescheinigung anfordern (Üyelik belgesi talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'krankenkasse',
  'Mitgliedsbescheinigung anfordern',
  'Sağlık sigortası üyelik belgesinin talep edilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Krankenkasse]

{{date}}

Betreff: Anforderung einer Mitgliedsbescheinigung – {{subject}}
Versichertennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich Sie, mir eine aktuelle Mitgliedsbescheinigung auszustellen.

Die Bescheinigung wird für folgenden Zweck benötigt:
{{purpose}}

Bitte senden Sie die Bescheinigung an die oben genannte Adresse. Falls eine Ausstellung per E-Mail möglich ist, erreichen Sie mich auch unter: {{email}}

Ich danke Ihnen im Voraus für die zügige Bearbeitung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"purpose","label":"Belge Kullanım Amacı","type":"textarea","required":true},{"key":"email","label":"E-Posta Adresi","type":"text","required":false}]',
  true
);

-- 11. Krankenkasse - Rechnung/Beitrag klären (Fatura/aidat açıklama)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'krankenkasse',
  'Rechnung/Beitrag klären',
  'Sağlık sigortası faturası veya aidat tutarı hakkında açıklama talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Krankenkasse]

{{date}}

Betreff: Klärung einer Rechnung/Beitragsabrechnung – {{subject}}
Versichertennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

ich habe Ihre Abrechnung/Rechnung vom {{invoice_date}} erhalten und bitte um Klärung folgender Punkte:

{{questions}}

Der in Rechnung gestellte Betrag in Höhe von {{amount}} EUR erscheint mir nicht nachvollziehbar. Ich bitte Sie daher um eine detaillierte Aufschlüsselung der Berechnung.

Bis zur Klärung des Sachverhalts bitte ich Sie, von Mahnmaßnahmen abzusehen.

Vielen Dank für Ihre Unterstützung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"invoice_date","label":"Fatura Tarihi","type":"date","required":true},{"key":"amount","label":"Fatura Tutarı (EUR)","type":"text","required":true},{"key":"questions","label":"Açıklama İstenen Konular","type":"textarea","required":true}]',
  true
);

-- 12. Krankenkasse - Adresse ändern (Adres değişikliği)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'krankenkasse',
  'Adresse ändern',
  'Sağlık sigortasındaki adres bilgisinin güncellenmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Krankenkasse]

{{date}}

Betreff: Adressänderung – {{subject}}
Versichertennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen mit, dass sich meine Anschrift geändert hat. Ich bitte Sie, meine Adresse in Ihren Unterlagen wie folgt zu aktualisieren:

Bisherige Adresse:
{{old_address}}

Neue Adresse (gültig ab {{change_date}}):
{{new_address}}

Bitte senden Sie zukünftige Korrespondenz an meine neue Adresse. Falls eine Anmeldebestätigung erforderlich ist, liegt diese bei.

Vielen Dank für die Aktualisierung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Yeni Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"old_address","label":"Eski Adres","type":"textarea","required":true},{"key":"new_address","label":"Yeni Adres","type":"textarea","required":true},{"key":"change_date","label":"Değişiklik Tarihi","type":"date","required":true}]',
  true
);

-- ============================================
-- FINANZAMT ŞABLONLARİ (3 adet)
-- ============================================

-- 13. Finanzamt - Steuernummer anfragen (Vergi numarası talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'finanzamt',
  'Steuernummer anfragen',
  'Vergi dairesinden vergi numarası talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Finanzamts]

{{date}}

Betreff: Anfrage zur Erteilung einer Steuernummer – {{subject}}
Steuer-ID: {{customer_number}}

Sehr geehrte Damen und Herren,

ich bin seit dem {{registration_date}} in Ihrem Zuständigkeitsbereich gemeldet und benötige eine Steuernummer für folgende Zwecke:

{{purpose}}

Meine persönlichen Daten:
- Name: {{full_name}}
- Anschrift: {{address}}
- Steuerliche Identifikationsnummer: {{customer_number}}
- Geburtsdatum: {{birth_date}}

Ich bitte Sie, mir eine Steuernummer zuzuteilen und diese an die oben genannte Adresse zu senden.

Vielen Dank für Ihre Bearbeitung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"registration_date","label":"Kayıt Tarihi","type":"date","required":true},{"key":"birth_date","label":"Doğum Tarihi","type":"date","required":true},{"key":"purpose","label":"Talep Amacı","type":"textarea","required":true}]',
  true
);

-- 14. Finanzamt - Fristverlängerung Steuererklärung (Vergi beyannamesi süre uzatma)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'finanzamt',
  'Fristverlängerung Steuererklärung',
  'Vergi beyannamesi teslim süresinin uzatılması talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Finanzamts]

{{date}}

Betreff: Antrag auf Fristverlängerung für die Steuererklärung {{tax_year}} – {{subject}}
Steuernummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit beantrage ich eine Verlängerung der Abgabefrist für meine Einkommensteuererklärung für das Jahr {{tax_year}}.

Die reguläre Frist endet am {{original_deadline}}. Ich bitte um eine Verlängerung bis zum {{requested_deadline}}.

Begründung:
{{reason}}

Ich versichere, die Steuererklärung innerhalb der beantragten Frist einzureichen. Sollte meinem Antrag nicht stattgegeben werden können, bitte ich um eine kurze schriftliche Mitteilung.

Vielen Dank für Ihre Berücksichtigung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"tax_year","label":"Vergi Yılı","type":"text","required":true},{"key":"original_deadline","label":"Mevcut Son Tarih","type":"date","required":true},{"key":"requested_deadline","label":"Talep Edilen Yeni Tarih","type":"date","required":true},{"key":"reason","label":"Uzatma Nedeni","type":"textarea","required":true}]',
  true
);

-- 15. Finanzamt - Nachweise einreichen (Belge gönderme)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'finanzamt',
  'Nachweise einreichen',
  'Vergi dairesine istenen belgelerin gönderilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Finanzamts]

{{date}}

Betreff: Einreichung angeforderter Nachweise – {{subject}}
Steuernummer: {{customer_number}}

Sehr geehrte Damen und Herren,

in Bezug auf Ihr Schreiben vom {{letter_date}} übersende ich Ihnen hiermit die angeforderten Nachweise und Belege:

{{document_list}}

Ich bitte Sie, die eingereichten Unterlagen zu prüfen und die Bearbeitung meines Steuervorgangs fortzusetzen. Sollten weitere Nachweise erforderlich sein, bitte ich um eine entsprechende Mitteilung.

Für Rückfragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"letter_date","label":"Referans Yazı Tarihi","type":"date","required":true},{"key":"document_list","label":"Eklenen Belgeler","type":"textarea","required":true}]',
  true
);

-- ============================================
-- WOHNUNG ŞABLONLARİ (3 adet)
-- ============================================

-- 16. Wohnung - Mietbescheinigung anfordern (Kira belgesi talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'wohnung',
  'Mietbescheinigung anfordern',
  'Ev sahibinden veya yönetim şirketinden kira belgesi talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Vermieters/der Hausverwaltung]

{{date}}

Betreff: Anforderung einer Mietbescheinigung – {{subject}}
Mieternummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit bitte ich Sie um die Ausstellung einer Mietbescheinigung für die von mir bewohnte Wohnung unter folgender Adresse:

{{rental_address}}

Die Mietbescheinigung wird für folgenden Zweck benötigt:
{{purpose}}

Bitte geben Sie in der Bescheinigung folgende Angaben an:
- Mietbeginn
- Monatliche Kaltmiete und Nebenkosten
- Wohnungsgröße in Quadratmetern
- Anzahl der Zimmer

Ich bitte um eine baldige Zusendung an meine oben genannte Adresse.

Vielen Dank im Voraus.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"rental_address","label":"Kira Adresi","type":"textarea","required":true},{"key":"purpose","label":"Belge Kullanım Amacı","type":"textarea","required":true}]',
  true
);

-- 17. Wohnung - Reparatur melden (Onarım bildirimi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'wohnung',
  'Reparatur melden',
  'Ev sahibine veya yönetim şirketine onarım/arıza bildirimi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Vermieters/der Hausverwaltung]

{{date}}

Betreff: Meldung eines Reparaturbedarfs – {{subject}}
Mieternummer: {{customer_number}}

Sehr geehrte Damen und Herren,

hiermit melde ich folgenden Mangel bzw. Reparaturbedarf in meiner Mietwohnung:

Beschreibung des Mangels:
{{defect_description}}

Ort des Mangels: {{defect_location}}

Der Mangel besteht seit dem {{defect_since}}.

Ich bin für die Durchführung der Reparatur zu folgenden Zeiten erreichbar:
{{availability}}

Bitte teilen Sie mir mit, wann ein Handwerker die Reparatur durchführen kann. Ich weise darauf hin, dass gemäß § 535 BGB die Instandhaltung der Mietsache zu den Pflichten des Vermieters gehört.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"defect_description","label":"Arıza Açıklaması","type":"textarea","required":true},{"key":"defect_location","label":"Arıza Yeri","type":"text","required":true},{"key":"defect_since","label":"Arıza Başlangıç Tarihi","type":"date","required":true},{"key":"availability","label":"Uygun Olduğunuz Zamanlar","type":"textarea","required":true}]',
  true
);

-- 18. Wohnung - Kündigungsbestätigung anfragen (Fesih onayı sorgusu)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'wohnung',
  'Kündigungsbestätigung anfragen',
  'Kira sözleşmesi fesih onayının talep edilmesi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse des Vermieters/der Hausverwaltung]

{{date}}

Betreff: Bitte um Kündigungsbestätigung – {{subject}}
Mieternummer: {{customer_number}}

Sehr geehrte Damen und Herren,

am {{cancellation_date}} habe ich die Kündigung meines Mietvertrags für die Wohnung in der {{rental_address}} fristgerecht eingereicht. Das Mietverhältnis endet somit zum {{end_date}}.

Bis heute habe ich leider keine schriftliche Bestätigung meiner Kündigung erhalten. Ich bitte Sie daher höflich, mir eine Kündigungsbestätigung zuzusenden, die folgende Punkte enthält:

- Bestätigung des Erhalts der Kündigung
- Bestätigung des Beendigungsdatums des Mietverhältnisses
- Termin für die Wohnungsübergabe bzw. Vorabnahme

Für die Planung meines Auszugs benötige ich diese Bestätigung zeitnah.

Vielen Dank für Ihre Mühe.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"cancellation_date","label":"Fesih Bildirimi Tarihi","type":"date","required":true},{"key":"rental_address","label":"Kira Adresi","type":"text","required":true},{"key":"end_date","label":"Kira Bitiş Tarihi","type":"date","required":true}]',
  true
);

-- ============================================
-- ALLGEMEIN ŞABLONLARİ (2 adet)
-- ============================================

-- 19. Allgemein - Empfangsbestätigung bitten (Alındı onayı talebi)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'allgemein',
  'Empfangsbestätigung bitten',
  'Gönderilen belgelerin alındığının teyit edilmesi talebi',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde/Firma]

{{date}}

Betreff: Bitte um Empfangsbestätigung – {{subject}}
Aktenzeichen/Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

am {{submission_date}} habe ich Ihnen folgende Unterlagen zugesandt:

{{document_list}}

Bis zum heutigen Tag habe ich keine Bestätigung über den Eingang meiner Unterlagen erhalten. Ich bitte Sie daher höflich, mir den Empfang der oben genannten Dokumente schriftlich zu bestätigen.

Dies ist für meine Unterlagen und zur Wahrung etwaiger Fristen von Bedeutung.

Vielen Dank im Voraus für Ihre Rückmeldung.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"submission_date","label":"Belge Gönderim Tarihi","type":"date","required":true},{"key":"document_list","label":"Gönderilen Belgeler","type":"textarea","required":true}]',
  true
);

-- 20. Allgemein - Sachstandsanfrage (Durum sorgusu)
INSERT INTO templates (category, title, description, language, content, variables, is_active) VALUES (
  'allgemein',
  'Sachstandsanfrage',
  'Devam eden bir işlem hakkında güncel durum sorgusu',
  'de',
  '{{full_name}}
{{address}}

{{authority_name}}
[Adresse der Behörde/Firma]

{{date}}

Betreff: Sachstandsanfrage zu meinem Vorgang – {{subject}}
Aktenzeichen/Kundennummer: {{customer_number}}

Sehr geehrte Damen und Herren,

am {{application_date}} habe ich bei Ihnen folgenden Antrag gestellt bzw. folgenden Vorgang eingeleitet:

{{case_description}}

Seitdem sind {{weeks_passed}} Wochen vergangen, und ich habe bislang keine Rückmeldung zum aktuellen Bearbeitungsstand erhalten.

Ich bitte Sie höflich, mich über den derzeitigen Stand der Bearbeitung zu informieren und mir mitzuteilen, ob von meiner Seite weitere Schritte erforderlich sind.

Sollte die Bearbeitung noch Zeit in Anspruch nehmen, wäre ich Ihnen für eine kurze Zwischenmitteilung mit einer voraussichtlichen Bearbeitungsdauer dankbar.

Vielen Dank für Ihre Bemühungen.

Mit freundlichen Grüßen

{{full_name}}',
  '[{"key":"full_name","label":"Ad Soyad","type":"text","required":true},{"key":"address","label":"Adres","type":"textarea","required":true},{"key":"customer_number","label":"Müşteri/Dosya Numarası","type":"text","required":false},{"key":"date","label":"Tarih","type":"date","required":true},{"key":"authority_name","label":"Kurum Adı","type":"text","required":true},{"key":"subject","label":"Konu","type":"text","required":false},{"key":"application_date","label":"Başvuru Tarihi","type":"date","required":true},{"key":"case_description","label":"İşlem Açıklaması","type":"textarea","required":true},{"key":"weeks_passed","label":"Geçen Süre (Hafta)","type":"text","required":true}]',
  true
);
