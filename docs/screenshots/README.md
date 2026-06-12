# Ekran görüntüleri

README, GitHub ve **landing sayfası** için görseller bu klasörde üretilir.

## Yeniden oluşturma

```bash
# Uygulama otomatik başlar; dashboard görselleri için .env.local içinde E2E kullanıcısı gerekli
npm run screenshots
npm run screenshots:gif   # opsiyonel — ffmpeg ile demo.gif
npm run sync:marketing    # docs/screenshots → public/marketing (locale alt klasörleri)
```

Tek komut:

```bash
npm run screenshots && npm run sync:marketing
```

## Dosya yapısı

| Yol | Açıklama |
|-----|----------|
| `landing-hero.png` | Ana sayfa üst bölüm (kök) |
| `demo.gif` | Landing turu animasyonu (kök) |
| `{locale}/dashboard.png` | Kontrol paneli |
| `{locale}/upload.png` | Belge yükleme |
| `{locale}/templates.png` | Şablon listesi |
| `{locale}/landing-how-it-works.png` | Vitrin — analiz sekmesi |
| `{locale}/landing-pricing.png` | Vitrin — fiyatlandırma sekmesi |

Desteklenen `{locale}` değerleri: `tr`, `de`, `en`, `az`, `ru`, `uk`, `ar`

`public/marketing/{locale}/` — `product-showcase-section` bileşeninin kullandığı kopyalar.

`gif-frames/` geçici kareler içerir; Git'e eklenmez.
