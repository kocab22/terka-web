# Nasazení na Netlify - Kompletní průvodce

## 🚀 Rychlé nasazení (5 kroků)

### Krok 1: Příprava repository
```bash
git add .
git commit -m "Připraveno pro Netlify deployment"
git push origin main
```

### Krok 2: Připojení k Netlify
1. Jděte na [netlify.com](https://netlify.com) a přihlaste se
2. Klikněte "New site from Git"
3. Vyberte GitHub a váš repository `terka-web`
4. Build settings:
   - **Build command**: `echo 'Static site'` (nebo ponechte prázdné)
   - **Publish directory**: `.` (root)
5. Klikněte "Deploy site"

### Krok 3: Povolení Netlify Forms
1. V Netlify admin přejděte do **Site settings** → **Forms**
2. Povolte **Form notifications** 
3. Nastavte email pro notifikace

### Krok 4: Aktivace Netlify Identity (pro CMS)
1. V Netlify admin přejděte do **Site settings** → **Identity**
2. Klikněte **Enable Identity**
3. V **Registration preferences** vyberte **Invite only**
4. V **Git Gateway** klikněte **Enable Git Gateway**

### Krok 5: Přidání admin uživatele
1. V **Identity** klikněte **Invite users**
2. Zadejte email administrátora
3. Admin dostane email s pozváním
4. Po registraci může přistupovat na `/admin/`

## 🔒 Zabezpečení před Googlem

Web už má v `robots.txt`:
```
User-agent: *
Disallow: /
```

### Pro spuštění indexování (později):
1. Upravte `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://your-site.netlify.app/sitemap.xml
```

## 📝 Přístup k CMS

### URL pro správu obsahu:
- **CMS rozhraní**: `https://your-site.netlify.app/admin/`
- **Přihlášení**: Pouze pozvaní uživatelé

### Co lze upravovat v CMS:
- ✅ **Blog příspěvky** - přidávání/editace článků
- ✅ **Obsah stránek** - texty všech sekcí
- ✅ **Reference** - přidávání/editace klientských hodnocení  
- ✅ **Kontaktní údaje** - email, telefon, rozvrh
- ✅ **SEO nastavení** - titulky, popisy, klíčová slova
- ✅ **Obrázky** - nahrávání do assets/uploads

## 🛠️ Pokročilé nastavení

### Vlastní doména (volitelné)
1. V Netlify admin → **Domain management** 
2. **Add custom domain**
3. Nastavte DNS záznamy u registrátora domény

### SSL certifikát
- Automaticky aktivován po nasazení
- Vynutí HTTPS přesměrování

### Formulář funguje automaticky
- Netlify detekuje `data-netlify="true"`
- Zprávy dorazí na email nastavený v notifikacích
- Antispam ochrana je aktivní (honeypot + matematická otázka)

## 📊 Monitoring

### Netlify Analytics (volitelné)
- V admin → **Site settings** → **Analytics**
- $9/měsíc pro detailní statistiky

### Alternativa - Google Analytics
Přidejte do `index.html` před `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Řešení problémů

### Formulář nefunguje
- Zkontrolujte `data-netlify="true"` v HTML
- Ověřte email notifikace v Netlify admin

### CMS se nenačítá
- Zkontrolujte, zda je Identity povolen
- Ověřte Git Gateway nastavení
- Zkontrolujte admin/config.yml syntax

### 404 chyby
- Ověřte `netlify.toml` konfiguraci
- Zkontrolujte redirects nastavení

## 📋 Checklist před spuštěním

- [ ] Repository pushed na GitHub
- [ ] Site nasazen na Netlify  
- [ ] Netlify Forms povolen
- [ ] Netlify Identity nastaven
- [ ] Admin uživatel pozván
- [ ] Testovací email formuláře odeslán
- [ ] CMS přístup otestován
- [ ] robots.txt zkontrolován (blokuje Google)
- [ ] SSL certifikát aktivní
- [ ] Vlastní doména nastavena (volitelné)

## 🎉 Po spuštění

1. **Otestujte formulář** - odešlete testovací zprávu
2. **Přihlaste se do CMS** - ověřte funkčnost admin rozhraní  
3. **Vytvořte první blog post** - test content managementu
4. **Nastavte monitoring** - Google Analytics nebo Netlify Analytics
5. **Sdílejte URL** s majitelem webu pro testování

---

**URL webu**: `https://[site-name].netlify.app`  
**Admin rozhraní**: `https://[site-name].netlify.app/admin/`