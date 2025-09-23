# Kontaktní formulář - Kompletní průvodce pro statické weby

## 🚀 Možnosti pro GitHub Pages (bez backendu)

### 1. **Formspree** (doporučeno) ⭐
**Výhody**: Nejjednodušší nastavení, spolehlivé, free tier 50 formulářů/měsíc
**Nevýhody**: Omezený free tier

#### Nastavení:
1. Jděte na [formspree.io](https://formspree.io)
2. Zaregistrujte se a vytvořte nový formulář
3. Zkopírujte Form ID (např. `xvgpvwql`)
4. V `index.html` změňte:
```html
<form action="https://formspree.io/f/xvgpvwql" method="POST">
```

### 2. **Netlify Forms** (pokud používáte Netlify)
**Výhody**: Bezplatné, integrace s Netlify, 100 formulářů/měsíc
**Nevýhody**: Pouze pro Netlify hosting

#### Nastavení:
- Formulář už je připraven s `data-netlify="true"`
- Stačí nahrát na Netlify a automaticky funguje

### 3. **EmailJS** (100% JavaScript řešení)
**Výhody**: Funguje všude, 200 emailů/měsíc zdarma
**Nevýhody**: Složitější nastavení, vyžaduje API klíče

#### Nastavení EmailJS:
1. Zaregistrujte se na [emailjs.com](https://www.emailjs.com)
2. Vytvořte email service (Gmail, Outlook, atd.)
3. Vytvořte email template
4. Získejte Public Key, Service ID a Template ID
5. Použijte kód z `emailjs-example.js`

### 4. **Mailto fallback** (nejjednodušší)
**Výhody**: Funguje vždy, žádné nastavení
**Nevýhody**: Otevře emailového klienta uživatele

## 🔒 Alternativy k reCAPTCHA

### 1. **Honeypot pole** (už implementováno)
- Skryté pole, které vyplní pouze boti
- Jednoduché a efektivní

### 2. **Matematická otázka** (už implementováno)
- Jednoduchá matematická úloha
- Přátelské k uživatelům

### 3. **Časová validace**
```javascript
// Přidat do formuláře:
const startTime = Date.now();

// Při odeslání zkontrolovat:
const submitTime = Date.now();
if (submitTime - startTime < 3000) {
    // Pravděpodobně bot (odeslal příliš rychle)
    return false;
}
```

## 📋 Aktuální konfigurace

Váš formulář je momentálně nastaven pro:
- ✅ Netlify Forms (pokud nahrajete na Netlify)
- ✅ Formspree (když změníte action URL)
- ✅ Mailto fallback (když žádná služba nefunguje)
- ✅ Honeypot ochrana proti botům
- ✅ Matematická otázka proti spamu

## 🎯 Doporučení pro GitHub Pages:

### Nejlepší varianta: **Formspree**
1. Jděte na formspree.io
2. Zaregistrujte se (je to zdarma)
3. Vytvořte nový formulář
4. Zkopírujte Form ID
5. V `index.html` změňte řádek:
```html
<form id="contact-form" class="contact-form" action="https://formspree.io/f/VÁŠ_FORM_ID" method="POST">
```

### Alternativa: **EmailJS** (pro větší kontrolu)
1. Zaregistrujte se na emailjs.com
2. Nastavte email service
3. Vytvořte template
4. Použijte kód z `emailjs-example.js`
5. V `index.html` přidejte:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

## 🔧 Testování

1. Nahrajte na GitHub Pages
2. Otevřete stránku
3. Vyplňte formulář
4. Zkontrolujte:
   - Honeypot pole zůstává prázdné
   - Správná odpověď na matematickou otázku
   - Email dorazí na váš email

## 💡 Tipy pro produkci

1. **Spam ochrana**: Kombinujte honeypot + matematickou otázku
2. **Monitoring**: Sledujte FormSpree/EmailJS dashboard
3. **Fallback**: Vždy mějte mailto jako záložní řešení
4. **Validace**: Zkontrolujte všechna pole na frontend i backend straně