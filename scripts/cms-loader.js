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

  parseYAML(yamlText) {
    const data = {};
    const lines = yamlText.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;
      
      if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Odstraň úvodní a koncové uvozovky
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Zpracuj víceřádkový obsah (>)
        if (value === '>') {
          value = '';
          continue; // Víceřádkový obsah zatím přeskočíme pro jednoduchost
        }
        
        data[key] = value;
      }
    }
    
    return data;
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
    // Aktualizuj about sekci
    const aboutTitle = document.querySelector('#co h2');
    const leftColumn = document.querySelector('#co .two-column .column:first-child p');
    const rightColumn = document.querySelector('#co .two-column .column:last-child p');

    if (aboutTitle && data.title) {
      aboutTitle.textContent = data.title;
    }

    if (leftColumn && data.left_column) {
      leftColumn.textContent = data.left_column;
    }

    if (rightColumn && data.right_column) {
      rightColumn.textContent = data.right_column;
    }
  }
}

// Inicializuj CMS loader když se načte DOM
document.addEventListener('DOMContentLoaded', () => {
  new CMSLoader();
});