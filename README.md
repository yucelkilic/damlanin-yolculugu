# Damla’nın Yolculuğu

Konyaaltı Fahrettin Sert İlkokulu 4/A öğrencilerinin su tasarrufu ve yağmur suyu hasadı projesi için hazırlanmış statik web sitesi.

Anasayfada etkileşimli su yolculuğu, mini oyun, değişen su görevleri ve proje günlüğü bulunur. Verilen animasyonlu sunum `sunum/index.html` içinde korunmuştur. Ekip bölümünde kullanıcı tarafından verilen yedi öğrenci kaydı ve dört öğretmen bulunur. Listede iki kez geçen Elif Sare, iki ayrı kayıt olarak korunmuştur. Gerçekleşmiş etkinlikler hakkında ek bilgi uydurulmamıştır. Okul ve sistem çizimleri temsilidir.

## Yerelde açma

Bağımlılık kurulumu veya derleme gerekmez. Proje klasöründe:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Tarayıcı: http://127.0.0.1:4173

Node.js varsa dosya ve bağlantı kontrolü:

```sh
npm run check
```

Yazı tipleri Google Fonts üzerinden gelir; bağlantı yoksa sistem yazı tipleri kullanılır. Site ve sunum için sunucu uygulaması, hesap veya veritabanı gerekmez. Sesli sunum cihazın Türkçe ses desteğine bağlıdır.

## GitHub Pages ile yayınlama

1. GitHub’da boş bir depo oluşturun. Önerilen depo adı: `damlanin-yolculugu`. GitHub Free kullanıyorsanız Pages için herkese açık depo seçin.
2. Bu klasörde aşağıdaki komutları çalıştırın. `KULLANICI` yerine GitHub kullanıcı/kurum adınızı yazın:

```sh
git init -b main
git add .
git commit -m "Damla’nın Yolculuğu sitesini oluştur"
git remote add origin https://github.com/KULLANICI/damlanin-yolculugu.git
git push -u origin main
```

3. Depoda **Settings → Pages → Build and deployment → Source → GitHub Actions** seçin.
4. **Actions → GitHub Pages → Run workflow** ile ilk yayını başlatın. Bundan sonraki `main` gönderimleri otomatik yayınlanır.
5. İşlem tamamlanınca **Settings → Pages** veya ilgili Actions çalışmasının `github-pages` ortamı yayın adresini gösterir. Normal proje adresi `https://KULLANICI.github.io/damlanin-yolculugu/` biçimindedir.

Tüm yerel bağlantılar göreli olduğu için hem depo alt yolunda hem özel alan adında çalışır. Yayın akışı yalnızca web dosyalarını paketler; README, geliştirme dosyaları ve Git bilgileri yayınlanmaz.

## Özel alan adı

Alan adı satın alındıktan sonra:

1. Depoda **Settings → Pages → Custom domain** alanına alan adını girin.
2. Kök dizinde `CNAME` adlı bir dosya oluşturup yalnızca alan adını yazın (ör. `www.ornek-alan-adi.org`; `https://` veya yol eklemeyin), commit edip gönderin. Yayın akışı bu dosyayı otomatik dahil eder.
3. DNS sağlayıcınızda GitHub’ın güncel yönergelerine göre kayıtları ayarlayın. `www` gibi bir alt alan için CNAME hedefi `KULLANICI.github.io` olur; depo yolu eklenmez.
4. DNS doğrulamasından ve sertifika hazırlığından sonra **Enforce HTTPS** seçeneğini açın. Alan adını GitHub hesabınızda doğrulamanız önerilir.

Henüz seçilmemiş bir alan adı için CNAME eklenmedi. Kök alan adı A/AAAA kayıtları ve alan doğrulaması için güncel kaynaklar:

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

## İçeriği güncelleme

- **Metinler, ekip, günlük:** `index.html`
- **Renkler, düzen, mobil görünüm:** `styles.css`
- **Durak açıklamaları, oyun ve günlük görevler:** `app.js`
- **Çizimler:** `assets/`
- **Animasyonlu sunum:** `sunum/index.html`
- **Otomatik yayın:** `.github/workflows/pages.yml`

Günlükteki gelecek etkinlik yerlerini gerçek çalışmalar eklendikçe güncelleyin. Yayınlanacak öğrenci isimlerini ve fotoğrafları okul/veli izinleriyle belirleyin. Avatarlar öğrencilerin portreleri değildir. Öğretmenler, görev dağılımı belirtilmediği için isimlerinin yanında “Öğretmen” ifadesiyle gösterilir.
