# Ekran görüntüleri

README, GitHub ve **landing sayfası** (`public/marketing/`) için görseller bu klasörde üretilir.

## Yeniden oluşturma

```bash
# Uygulama otomatik başlar; dashboard görselleri için .env.local içinde E2E kullanıcısı gerekli
npm run screenshots
npm run screenshots:gif   # opsiyonel — ffmpeg ile demo.gif
npm run sync:marketing  # docs/screenshots → public/marketing kopyası
```

Tek komut (landing PNG + senkron):

```bash
npm run screenshots && npm run sync:marketing
```

## Dosyalar

| Dosya | Açıklama | Landing kullanımı |
|-------|----------|-------------------|
| `demo.gif` | Landing turu animasyonu | `video-demo-section` |
| `landing-hero.png` | Ana sayfa üst bölüm | — |
| `landing-how-it-works.png` | Nasıl çalışır / analiz sekmesi | `product-showcase-section` |
| `landing-pricing.png` | Fiyatlandırma | `product-showcase-section` |
| `dashboard.png` | Kullanıcı paneli | `hero-section`, showcase |
| `templates.png` | Şablon listesi | `product-showcase-section` |
| `upload.png` | Belge yükleme | `product-showcase-section` |

`public/marketing/` — Next.js `Image` ile servis edilen kopyalar (`npm run sync:marketing`).

`gif-frames/` geçici kareler içerir; Git'e eklenmez.
