# Nasazení na GitHub Pages - Rychlý start

## 🚀 3 kroky k funkčnímu formuláři na GitHub Pages:

### Krok 1: Nahrajte soubory na GitHub
```bash
git add .
git commit -m "Přidán kontaktní formulář"
git push origin main
```

### Krok 2: Aktivujte GitHub Pages
1. Jděte do Settings vašeho GitHub repozitáře
2. Klikněte na "Pages" v levém menu
3. V "Source" vyberte "Deploy from a branch"
4. Vyberte "main" branch a "/ (root)"
5. Klikněte "Save"

### Krok 3: Nastavte Formspree (doporučeno)
1. Jděte na [formspree.io](https://formspree.io)
2. Zaregistrujte se zdarma
3. Klikněte "+ New Form"
4. Zadejte název formuláře (např. "Terka Contact Form")
5. Zkopírujte Form ID (např. `xvgpvwql`)
6. V `index.html` změňte řádek 108:

**Z:**
```html
<form id="contact-form" class="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
```

**Na:**
```html
<form id="contact-form" class="contact-form" action="https://formspree.io/f/xvgpvwql" method="POST">
```

### ✅ Hotovo!
Váš formulář bude fungovat na adrese: `https://VÁŠE_GITHUB_JMÉNO.github.io/terka-web`

## 🔄 Alternativní možnosti:

### A) Netlify (místo GitHub Pages)
1. Připojte GitHub repo k Netlify
2. Nechte současné nastavení (`data-netlify="true"`)
3. Formulář automaticky funguje

### B) EmailJS (pokud chcete větší kontrolu)
1. Zaregistrujte se na [emailjs.com](https://emailjs.com)
2. Nastavte email service a template
3. Použijte kód z `emailjs-example.js`
4. Přidejte EmailJS script do `index.html`

### C) Jen mailto (nejjednodušší fallback)
- Formulář už má automatický fallback na mailto
- Funguje i bez jakékoli služby
- Otevře emailového klienta uživatele

## 🔧 Testování
Po nasazení:
1. Otevřete vaši GitHub Pages URL
2. Přejděte do sekce Kontakt
3. Vyplňte formulář
4. Vyřešte matematickou otázku
5. Odešlete - email by měl dorazit na váš email

## 💡 Pro produkci nezapomeňte:
- [ ] Změnit email adresu z `kontakt@gmail.com` na vaši skutečnou
- [ ] Otestovat formulář
- [ ] Nastavit vlastní doménu (volitelné)
- [ ] Sledovat FormSpree dashboard pro statistiky