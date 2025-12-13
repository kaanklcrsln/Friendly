# GitHub Pages Deployment Checklist

## ✅ Yapılan Ayarlar

- [x] Vite config'de `base: '/Friendly/'` ayarlı
- [x] GitHub Actions workflow dosyası oluşturuldu (`.github/workflows/deploy.yml`)
- [x] Deploy script'i oluşturuldu (`deploy.sh`)
- [x] Deployment dokümantasyonu oluşturuldu (`DEPLOYMENT.md`)
- [x] Local build test başarılı (✓ 724.58 kB JS output)
- [x] Firebase public API key kullanılıyor (safe for GitHub Pages)
- [x] .gitignore dist klasörünü ignore ediyor

---

## 🚀 Deployment Adımları (Sırasıyla)

### Adım 1: Repository'i Hazırla
```bash
cd /Users/kaanklcrsln/Desktop/Jager/prj/Friendly

# Tüm değişiklikleri staging'e ekle
git add .

# Commit yap
git commit -m "Setup GitHub Pages deployment with GitHub Actions"

# Main branch'ine push et
git push origin main
```

### Adım 2: GitHub Repository Settings'ini Ayarla
1. https://github.com/kaanklcrsln/Friendly adresine git
2. **Settings** sekmesine tıkla
3. Sol menüde **Pages**'e tıkla
4. **Build and deployment** bölümünde:
   - **Source**: `GitHub Actions` seç (dropdown)
   - **Save** butonuna tıkla

### Adım 3: Deployment'ı Başlat
GitHub Actions otomatik çalışacak (main branch'e push yapınca)

### Adım 4: Deployment Durumunu İzle
1. Repository'de **Actions** sekmesine tıkla
2. "Deploy to GitHub Pages" workflow'unu göreceksin
3. Workflow tamamlanınca (yeşil checkmark), site yayında olur

### Adım 5: Siteyi Test Et
```
https://kaanklcrsln.github.io/Friendly/
```

Açılan sayfada:
- Login sayfası gözükmeli
- Friendly logo ve background görüntüsü yüklenmeli
- Google Maps yüklenmeli
- Firebase Auth çalışmalı

---

## 📋 Deployment Sonrası Kontrol Listesi

Site yayında olunca şu işlemleri kontrol et:

- [ ] Login sayfası yüklensin
- [ ] Friendly logo ve background resimleri görsün
- [ ] Email/şifre ile giriş yap (Firebase bağlantı test)
- [ ] Harita yüklensin (Google Maps API)
- [ ] Etkinlik oluştur (float button)
- [ ] Konum seç (Address Modal açılsın)
- [ ] Haritada pin'i görsün
- [ ] EventsPanel'de etkinlik listelensin
- [ ] Kategori sekmelerini test et
- [ ] Katılım (✓) ve red (✕) butonları çalışsın
- [ ] Dark mode toggle et ve test et

---

## 🔧 Manuel Deployment (İhtiyaç Halinde)

Eğer GitHub Actions'dan sorun çıkarsa:

```bash
# Option 1: gh-pages paketini kullan
npm install --save-dev gh-pages
npx gh-pages -d client/dist

# Option 2: Subtree push
git subtree push --prefix client/dist origin gh-pages
```

---

## 📊 Deployment Yapısı

```
Repository Root
├── .github/
│   └── workflows/
│       └── deploy.yml ← GitHub Actions workflow
├── client/
│   ├── src/
│   ├── dist/ ← Build output (GitHub Pages serve eder)
│   ├── public/
│   │   └── assets/ ← Resimler, etc.
│   └── vite.config.js (base: '/Friendly/')
├── DEPLOYMENT.md ← Detaylı guide
└── deploy.sh ← Manual deploy script
```

---

## 🌍 Final URLs

- **Development (Local)**
  ```
  http://localhost:3000
  ```

- **Production (GitHub Pages)**
  ```
  https://kaanklcrsln.github.io/Friendly/
  ```

Vite config zaten bu URL'ler için optimize edilmiş.

---

## ⚠️ Önemli Notlar

1. **Base Path**: `/Friendly/` ayarlı (GitHub username ve repo adına göre)
2. **API Keys**: Firebase public API key'i güvenli (auth ile korunmuş)
3. **Build Size**: ~724 KB JS (iyi performans için optimize edilebilir)
4. **Cache**: Tarayıcı cache sorunları olursa `Ctrl+Shift+Del` ile temizle

---

## 📞 Sorun Giderme Hızlı Referans

| Sorun | Çözüm |
|-------|-------|
| 404 hatası | base path kontrol et, cache temizle |
| Firebase çalışmıyor | API key'in "Don't restrict" olduğunu kontrol et |
| Resimler yüklenmiyorsa | `/Friendly/assets/` path'inin doğru olduğunu kontrol et |
| Actions fail | Actions sekmesinde error log'u oku |
| Harita yüklenmiyorsa | Google Maps API key'ini kontrol et, API aktif olduğunu doğrula |

---

Hepsi tamam! 🎉 Push et ve GitHub Pages'e yayınla!
