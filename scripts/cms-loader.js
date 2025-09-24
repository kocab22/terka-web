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
      console.log('Loading about content...');
      const response = await fetch('/content/about.yml');
      console.log('About response status:', response.status, response.ok);
      
      if (!response.ok) throw new Error('Failed to load about.yml');
      
      const yamlText = await response.text();
      console.log('About YAML text:', yamlText);
      
      const aboutData = this.parseYAML(yamlText);
      console.log('Parsed about data:', aboutData);
      
      this.updateAboutSection(aboutData);
    } catch (error) {
      console.error('Could not load about content from CMS:', error);
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
      
      if (trimmedLine.includes(':') && !isMultiline) {
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
        if (value === '>') {
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
      } else if (isMultiline && currentKey) {
        // Přidej řádek k víceřádkové hodnotě
        if (trimmedLine) {
          if (currentValue) currentValue += ' ';
          currentValue += trimmedLine;
        }
      }
    }
    
    // Uložíme poslední víceřádkovou hodnotu
    if (currentKey && isMultiline) {
      data[currentKey] = currentValue.trim();
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
    console.log('Updating about section with data:', data);
    
    // Aktualizuj about sekci - sekce má ID "kdo"
    const aboutTitle = document.querySelector('#kdo h2');
    const leftColumn = document.querySelector('#kdo .two-columns .column:first-child');
    const rightColumn = document.querySelector('#kdo .two-columns .column:last-child');

    console.log('Found elements:', {
      aboutTitle: aboutTitle ? 'found' : 'NOT FOUND',
      leftColumn: leftColumn ? 'found' : 'NOT FOUND', 
      rightColumn: rightColumn ? 'found' : 'NOT FOUND'
    });

    if (aboutTitle && data.title) {
      console.log('Setting title to:', data.title);
      aboutTitle.textContent = data.title;
    }

    if (leftColumn && data.left_column) {
      console.log('Setting left column to:', data.left_column);
      leftColumn.textContent = data.left_column;
    }

    if (rightColumn && data.right_column) {
      console.log('Setting right column to:', data.right_column);
      rightColumn.textContent = data.right_column;
    }
  }
}

// Inicializuj CMS loader když se načte DOM
document.addEventListener('DOMContentLoaded', () => {
  new CMSLoader();
});