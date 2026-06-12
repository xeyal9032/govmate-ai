import fs from 'fs';
import path from 'path';

const dir = 'messages';
const locales = ['tr', 'en', 'de', 'az', 'ru', 'uk', 'ar'];

const keys = {
  createUser: {
    tr: 'Kullanıcı Oluştur',
    en: 'Create User',
    de: 'Benutzer erstellen',
    az: 'İstifadəçi yarat',
    ru: 'Создать пользователя',
    uk: 'Створити користувача',
    ar: 'إنشاء مستخدم',
  },
  createUserTitle: {
    tr: 'Yeni Kullanıcı',
    en: 'New User',
    de: 'Neuer Benutzer',
    az: 'Yeni istifadəçi',
    ru: 'Новый пользователь',
    uk: 'Новий користувач',
    ar: 'مستخدم جديد',
  },
  createUserDesc: {
    tr: 'E-posta ve şifre ile yeni bir hesap oluşturun.',
    en: 'Create a new account with email and password.',
    de: 'Erstellen Sie ein neues Konto mit E-Mail und Passwort.',
    az: 'E-poçt və şifrə ilə yeni hesab yaradın.',
    ru: 'Создайте новую учётную запись с email и паролем.',
    uk: 'Створіть новий обліковий запис з email і паролем.',
    ar: 'أنشئ حسابًا جديدًا بالبريد الإلكتروني وكلمة المرور.',
  },
  passwordLabel: {
    tr: 'Şifre',
    en: 'Password',
    de: 'Passwort',
    az: 'Şifrə',
    ru: 'Пароль',
    uk: 'Пароль',
    ar: 'كلمة المرور',
  },
  userCreated: {
    tr: 'Kullanıcı oluşturuldu',
    en: 'User created',
    de: 'Benutzer erstellt',
    az: 'İstifadəçi yaradıldı',
    ru: 'Пользователь создан',
    uk: 'Користувача створено',
    ar: 'تم إنشاء المستخدم',
  },
  userCreateError: {
    tr: 'Kullanıcı oluşturulamadı',
    en: 'Failed to create user',
    de: 'Benutzer konnte nicht erstellt werden',
    az: 'İstifadəçi yaradıla bilmədi',
    ru: 'Не удалось создать пользователя',
    uk: 'Не вдалося створити користувача',
    ar: 'تعذّر إنشاء المستخدم',
  },
  create: {
    tr: 'Oluştur',
    en: 'Create',
    de: 'Erstellen',
    az: 'Yarat',
    ru: 'Создать',
    uk: 'Створити',
    ar: 'إنشاء',
  },
  deleteDocumentConfirm: {
    tr: 'Bu belgeyi kalıcı olarak silmek istediğinizden emin misiniz?',
    en: 'Are you sure you want to permanently delete this document?',
    de: 'Möchten Sie dieses Dokument dauerhaft löschen?',
    az: 'Bu sənədi həmişəlik silmək istədiyinizə əminsiniz?',
    ru: 'Вы уверены, что хотите навсегда удалить этот документ?',
    uk: 'Ви впевнені, що хочете назавжди видалити цей документ?',
    ar: 'هل أنت متأكد أنك تريد حذف هذا المستند نهائيًا؟',
  },
  documentDeleted: {
    tr: 'Belge silindi',
    en: 'Document deleted',
    de: 'Dokument gelöscht',
    az: 'Sənəd silindi',
    ru: 'Документ удалён',
    uk: 'Документ видалено',
    ar: 'تم حذف المستند',
  },
  deleteLetterConfirm: {
    tr: 'Bu mektubu kalıcı olarak silmek istediğinizden emin misiniz?',
    en: 'Are you sure you want to permanently delete this letter?',
    de: 'Möchten Sie diesen Brief dauerhaft löschen?',
    az: 'Bu məktubu həmişəlik silmək istədiyinizə əminsiniz?',
    ru: 'Вы уверены, что хотите навсегда удалить это письмо?',
    uk: 'Ви впевнені, що хочете назавжди видалити цей лист?',
    ar: 'هل أنت متأكد أنك تريد حذف هذه الرسالة نهائيًا؟',
  },
  letterDeleted: {
    tr: 'Mektup silindi',
    en: 'Letter deleted',
    de: 'Brief gelöscht',
    az: 'Məktub silindi',
    ru: 'Письмо удалено',
    uk: 'Лист видалено',
    ar: 'تم حذف الرسالة',
  },
  deleteLogConfirm: {
    tr: 'Bu denetim kaydını silmek istediğinizden emin misiniz?',
    en: 'Are you sure you want to delete this audit log entry?',
    de: 'Möchten Sie diesen Audit-Log-Eintrag löschen?',
    az: 'Bu audit qeydini silmək istədiyinizə əminsiniz?',
    ru: 'Вы уверены, что хотите удалить эту запись аудита?',
    uk: 'Ви впевнені, що хочете видалити цей запис аудиту?',
    ar: 'هل أنت متأكد أنك تريد حذف سجل التدقيق هذا؟',
  },
  logDeleted: {
    tr: 'Log kaydı silindi',
    en: 'Audit log deleted',
    de: 'Audit-Log gelöscht',
    az: 'Audit qeydi silindi',
    ru: 'Запись аудита удалена',
    uk: 'Запис аудиту видалено',
    ar: 'تم حذف سجل التدقيق',
  },
  deleteLog: {
    tr: 'Logu Sil',
    en: 'Delete Log',
    de: 'Log löschen',
    az: 'Qeydi sil',
    ru: 'Удалить запись',
    uk: 'Видалити запис',
    ar: 'حذف السجل',
  },
};

for (const locale of locales) {
  const filePath = path.join(dir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const [key, translations] of Object.entries(keys)) {
    data.admin[key] = translations[locale];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Patched ${locale}.json`);
}
