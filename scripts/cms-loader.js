// CMS Content Loader
// Načítá obsah z YAML souborů a aktualizuje HTML

class CMSLoader {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.loadHomeContent();
      await this.loadAboutContent();
      await this.loadServicesContent();
      await this.loadPricingContent();
      await this.loadFaqContent();
      await this.loadContactContent();
      console.log('CMS content loaded successfully');
    } catch (error) {
      console.error('Error loading CMS content:', error);
      // Pokud se nepodaří načíst CMS data, ponecháme původní HTML
    }
  }

  async loadHomeContent() {
    try {
      const response = await fetch('/content/home.yml');
      if (!response.ok) throw new Error('Failed to load home.yml');
      
      const yamlText = await response.text();
      const homeData = this.parseYAML(yamlText);
      
      this.updateHomeSection(homeData);
    } catch (error) {
      console.warn('Could not load home content from CMS:', error);
    }
  }

  async loadAboutContent() {
    try {
      const response = await fetch('/content/about.yml');
      if (!response.ok) throw new Error('Failed to load about.yml');
      
      const yamlText = await response.text();
      const aboutData = this.parseYAML(yamlText);
      
      this.updateAboutSection(aboutData);
    } catch (error) {
      console.warn('Could not load about content from CMS:', error);
    }
  }

  async loadServicesContent() {
    try {
      const response = await fetch('/content/services.yml');
      if (!response.ok) throw new Error('Failed to load services.yml');
      
      const yamlText = await response.text();
      console.log('Services YAML text:', yamlText);
      
      const servicesData = this.parseYAML(yamlText);
      console.log('Parsed services data:', servicesData);
      
      this.updateServicesSection(servicesData);
    } catch (error) {
      console.warn('Could not load services content from CMS:', error);
    }
  }

  async loadPricingContent() {
    try {
      const response = await fetch('/content/pricing.yml');
      if (!response.ok) throw new Error('Failed to load pricing.yml');
      
      const yamlText = await response.text();
      console.log('Pricing YAML text:', yamlText);
      
      const pricingData = this.parseYAML(yamlText);
      console.log('Parsed pricing data:', pricingData);
      
      this.updatePricingSection(pricingData);
    } catch (error) {
      console.warn('Could not load pricing content from CMS:', error);
    }
  }

  async loadFaqContent() {
    try {
      const response = await fetch('/content/faq.yml');
      if (!response.ok) throw new Error('Failed to load faq.yml');
      
      const yamlText = await response.text();
      const faqData = this.parseYAML(yamlText);
      
      this.updateFaqSection(faqData);
    } catch (error) {
      console.warn('Could not load faq content from CMS:', error);
    }
  }

  async loadContactContent() {
    try {
      const response = await fetch('/content/contact.yml');
      if (!response.ok) throw new Error('Failed to load contact.yml');
      
      const yamlText = await response.text();
      const contactData = this.parseYAML(yamlText);
      
      this.updateContactSection(contactData);
    } catch (error) {
      console.warn('Could not load contact content from CMS:', error);
    }
  }

  parseYAML(yamlText) {
    const data = {};
    const lines = yamlText.split('\n');
    let currentKey = null;
    let currentValue = '';
    let isMultiline = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;
      
      // Pokud najdeme nový klíč (obsahuje :), ukončíme případný multiline
      if (trimmedLine.includes(':')) {
        // Pokud jsme byli v multiline módu, uložíme předchozí hodnotu
        if (currentKey && isMultiline) {
          data[currentKey] = currentValue.trim();
          currentValue = '';
          isMultiline = false;
        }
        
        const colonIndex = trimmedLine.indexOf(':');
        currentKey = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();
        
        // Zkontroluj, jestli je to víceřádkový text
        if (value === '>' || value === '|-') {
          isMultiline = true;
          currentValue = '';
        } else {
          // Odstraň úvodní a koncové uvozovky
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          data[currentKey] = value;
          currentKey = null;
        }
      } else if (isMultiline && currentKey && trimmedLine) {
        // Přidej řádek k víceřádkové hodnotě pouze pokud nejsme na novém klíči
        if (currentValue) currentValue += ' ';
        currentValue += trimmedLine;
      }
    }
    
    // Uložíme poslední víceřádkovou hodnotu
    if (currentKey && isMultiline) {
      data[currentKey] = currentValue.trim();
    }
    
    return data;
  }

  // Převede základní Markdown na HTML
  markdownToHtml(text) {
    if (!text) return '';
    
    return text
      // Bold + Italic: ***text*** -> <strong><em>text</em></strong>
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Zachovej odřádkování
      .replace(/\n/g, '<br>');
  }

  updateHomeSection(data) {
    // Aktualizuj hero sekci
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroButton = document.querySelector('.hero-text a');

    if (heroTitle && data.hero_title) {
      heroTitle.textContent = data.hero_title;
    }

    if (heroSubtitle && data.hero_subtitle) {
      heroSubtitle.textContent = data.hero_subtitle;
    }

    if (heroButton && data.hero_button_text) {
      heroButton.textContent = data.hero_button_text;
    }
  }

  updateAboutSection(data) {
    // Aktualizuj about sekci - sekce má ID "kdo"
    const aboutTitle = document.querySelector('#kdo h2');
    const leftColumn = document.querySelector('#kdo .two-columns .column:first-child');
    const rightColumn = document.querySelector('#kdo .two-columns .column:last-child');

    if (aboutTitle && data.title) {
      aboutTitle.textContent = data.title;
    }

    if (leftColumn && data.left_column) {
      leftColumn.innerHTML = this.markdownToHtml(data.left_column);
    }

    if (rightColumn && data.right_column) {
      rightColumn.innerHTML = this.markdownToHtml(data.right_column);
    }
  }

  updateServicesSection(data) {
    // Aktualizuj "Co dělám" sekci - sekce má ID "co"
    const servicesTitle = document.querySelector('#co h2');
    const servicesContent = document.querySelector('#co p');

    if (servicesTitle && data.title) {
      servicesTitle.textContent = data.title;
    }

    if (servicesContent && data.content) {
      servicesContent.innerHTML = this.markdownToHtml(data.content);
    }
  }

  updatePricingSection(data) {
    // Aktualizuj "Ceník" sekci - sekce má ID "cena"
    const pricingTitle = document.querySelector('#cena h2');
    const pricingContent = document.querySelector('#cena p');

    if (pricingTitle && data.title) {
      pricingTitle.textContent = data.title;
    }

    if (pricingContent && data.content) {
      pricingContent.innerHTML = this.markdownToHtml(data.content);
    }
  }

  updateFaqSection(data) {
    // Aktualizuj FAQ sekci - sekce má ID "faq"
    const faqTitle = document.querySelector('#faq h2');
    const faqContent = document.querySelector('#faq p');

    if (faqTitle && data.title) {
      faqTitle.textContent = data.title;
    }

    if (faqContent && data.intro) {
      faqContent.innerHTML = this.markdownToHtml(data.intro);
    }
  }

  updateContactSection(data) {
    // Aktualizuj kontaktní informace
    const emailLink = document.querySelector('.contact-details a[href^="mailto:"]');
    const phoneLink = document.querySelector('.contact-details a[href^="tel:"]');
    
    // Rozvrh
    const scheduleItems = {
      monday: document.querySelector('.schedule .schedule-item:nth-child(1) .time'),
      tuesday: document.querySelector('.schedule .schedule-item:nth-child(2) .time'),
      wednesday: document.querySelector('.schedule .schedule-item:nth-child(3) .time'),
      thursday: document.querySelector('.schedule .schedule-item:nth-child(4) .time'),
      friday: document.querySelector('.schedule .schedule-item:nth-child(5) .time'),
      saturday: document.querySelector('.schedule .schedule-item:nth-child(6) .time'),
      sunday: document.querySelector('.schedule .schedule-item:nth-child(7) .time')
    };

    const scheduleNote = document.querySelector('.vacation-notice p');

    // Aktualizuj email
    if (emailLink && data.email) {
      emailLink.href = `mailto:${data.email}`;
      emailLink.textContent = data.email;
    }

    // Aktualizuj telefon
    if (phoneLink && data.phone) {
      phoneLink.href = `tel:${data.phone}`;
      phoneLink.textContent = data.phone;
    }

    // Aktualizuj rozvrh
    if (data.schedule) {
      Object.keys(scheduleItems).forEach(day => {
        const element = scheduleItems[day];
        if (element && data.schedule[day]) {
          element.textContent = data.schedule[day];
        }
      });
    }

    // Aktualizuj poznámku o rozvrhu
    if (scheduleNote && data.schedule_note) {
      scheduleNote.innerHTML = `<strong>Poznámka:</strong> ${data.schedule_note}`;
    }
  }
}

// Inicializuj CMS loader když se načte DOM
document.addEventListener('DOMContentLoaded', () => {
  new CMSLoader();
});