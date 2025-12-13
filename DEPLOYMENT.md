# GitHub Pages Deployment Guide

## Otomatik Deployment (Önerilen)

GitHub Actions sayesinde otomatik deploy ayarı yapıldı. Şu adımları izle:

### 1. GitHub Repository Ayarı
```bash
# Repository'i GitHub'a push et (henüz yapmadıysan)
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 2. GitHub Settings'te Ayarla
1. Repository'e git: `https://github.com/kaanklcrsln/Friendly`
2. **Settings** → **Pages** sekmesine git
3. **Build and deployment** bölümünde:
   - **Source**: `GitHub Actions` seç
   - Deploy workflow'u otomatik çalışacak

### 3. Deployment Kontrol Et
- **Actions** sekmesine git
- "Deploy to GitHub Pages" workflow'unu göreceksin
- Workflow başarıyla çalışınca siteniz şu URL'de yayında olur:
  ```
  https://kaanklcrsln.github.io/Friendly/
  ```

---

## Manuel Deployment (İsteğe Bağlı)

Eğer otomatik çalışmazsa veya manuel deploy etmek istersen:

### Seçenek 1: gh-pages Paketi ile
```bash
# gh-pages paketini kur
npm install --save-dev gh-pages

# Deploy et
npx gh-pages -d client/dist
```

### Seçenek 2: Build Sonrası Manuel Push
```bash
# Build et
npm run build --workspace client

# dist klasörünü gh-pages branch'ine push et
git add client/dist
git commit -m "Build artifacts"
git subtree push --prefix client/dist origin gh-pages
```

---

## Deployment Sonrası Kontrol

Deployment tamamlandıktan sonra:

1. **Site URL'ini Kontrol Et**
   ```
   https://kaanklcrsln.github.io/Friendly/
   ```

2. **GitHub Pages Durumunu Kontrol Et**
   - Repository Settings → Pages
   - Status: "Your site is live" yazısını görmeli

3. **Test Et**
   - Logini dene
   - Etkinlik oluştur
   - Konum seç
   - Harita ve etkinlik panelini kontrol et

---

## Sorun Giderme

### 404 Hatası (sayfa bulunamadı)
- Vite config'de `base: '/Friendly/'` ayarı var mı kontrol et ✓
- Tarayıcı cache'ini temizle (Ctrl+Shift+Delete)

### GitHub Actions Başarısız
- Repository'de GitHub Token izinlerini kontrol et
- Actions sekmesinde error log'unu oku

### Firebase Bağlantısı Çalışmıyor
- Firebase config public (güvenli) anahtarı kullanıyor mu kontrol et
- API Keys'in "Don't restrict" yapıldığını kontrol et

---

## Environment Variables

Eğer sensitive data varsa (API keys, etc.):

1. GitHub Repository Settings → **Secrets and variables** → **Actions**
2. Yeni secret ekle (ör: `FIREBASE_API_KEY`)
3. Workflow dosyasında kullan:
   ```yml
   env:
     VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
   ```

Not: Şuanda Firebase config public API key kullandığı için gizleme gerekmiyor.

---

## Build Output

Build sonrası oluşan dosyalar:
- `client/dist/index.html` - Ana sayfa
- `client/dist/assets/` - CSS, JS, resimler
- `client/dist/` - Tüm static assets

GitHub Pages bu dosyaları otomatik olarak serve ediyor.
