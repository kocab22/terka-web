const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("main-nav");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (nav.classList.contains("active")) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("active");
    }
  }
});

document.addEventListener("touchstart", (e) => {
  if (nav.classList.contains("active")) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("active");
    }
  }
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const heroText = document.querySelector(".hero-text");
  const heroTextRect = heroText.getBoundingClientRect();
  if (window.scrollY === 0) {
    header.classList.remove("transparent");
  } else if (heroTextRect.top <= header.offsetHeight - 100) {
    header.classList.remove("transparent");
  } else {
    header.classList.add("transparent");
  }
});

// Rating System
class RatingSystem {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        this.hasVoted = localStorage.getItem('hasVoted') === 'true';
        this.init();
    }

    init() {
        this.updateDisplay();
        this.checkVotingStatus();
        
        if (!this.hasVoted) {
            this.attachEventListeners();
        }
    }

    checkVotingStatus() {
        const ratingSection = document.querySelector('.star-rating');
        const stars = document.querySelectorAll('.star');
        
        if (this.hasVoted) {
            ratingSection.classList.add('voted');
            stars.forEach(star => {
                star.style.cursor = 'not-allowed';
                star.title = 'Již jste hlasoval(a)';
            });
            
            // Zobrazit zprávu o hlasování
            if (!document.querySelector('.voted-message')) {
                const message = document.createElement('p');
                message.className = 'voted-message';
                message.textContent = 'Děkujeme za vaše hodnocení!';
                ratingSection.parentNode.insertBefore(message, ratingSection.nextSibling);
            }
        }
    }

    attachEventListeners() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                if (!this.hasVoted) {
                    const rating = parseInt(star.dataset.rating);
                    this.addRating(rating);
                    this.showFeedback(rating);
                }
            });
        });
    }

    addRating(rating) {
        this.ratings.push(rating);
        localStorage.setItem('ratings', JSON.stringify(this.ratings));
        localStorage.setItem('hasVoted', 'true');
        this.hasVoted = true;
        
        this.updateDisplay();
        this.checkVotingStatus();
    }

    updateDisplay() {
        const averageElement = document.getElementById('average-rating');
        const countElement = document.getElementById('vote-count');
        
        if (this.ratings.length === 0) {
            averageElement.textContent = '0.0';
            countElement.textContent = '0';
            return;
        }
        
        const average = this.ratings.reduce((sum, rating) => sum + rating, 0) / this.ratings.length;
        averageElement.textContent = average.toFixed(1);
        countElement.textContent = this.ratings.length;
    }

    showFeedback(rating) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: absolute;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 0.9rem;
            margin-top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;
        
        let message = '';
        switch(rating) {
            case 5: message = 'Děkuji za výborné hodnocení! ⭐'; break;
            case 4: message = 'Děkuji za skvělé hodnocení! 😊'; break;
            case 3: message = 'Děkuji za hodnocení! 👍'; break;
            case 2: message = 'Děkuji za zpětnou vazbu! 🙏'; break;
            case 1: message = 'Děkuji za zpětnou vazbu, budu se snažit lépe! 💪'; break;
        }
        
        feedback.textContent = message;
        
        const ratingSection = document.querySelector('.rating-section');
        ratingSection.style.position = 'relative';
        ratingSection.appendChild(feedback);
        
        setTimeout(() => feedback.style.opacity = '1', 100);
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// Contact Form Handler for Static Sites
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.statusDiv = document.getElementById('form-status');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.mathQuestion = document.getElementById('math-question');
        this.mathAnswer = document.getElementById('math-answer');
        this.currentAnswer = 0;
        this.init();
    }

    init() {
        this.generateMathQuestion();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    generateMathQuestion() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        this.currentAnswer = num1 + num2;
        this.mathQuestion.textContent = `${num1} + ${num2}`;
    }

    async handleSubmit(e) {
        // Validate honeypot field
        const honeypot = this.form.querySelector('input[name="bot-field"]');
        if (honeypot && honeypot.value !== '') {
            e.preventDefault();
            this.showStatus('Detekován spam. Formulář nebyl odeslán.', 'error');
            return;
        }

        // Validate math question
        const mathAnswer = parseInt(this.mathAnswer.value);
        if (mathAnswer !== this.currentAnswer) {
            e.preventDefault();
            this.showStatus('Nesprávná odpověď na matematickou otázku. Zkuste to znovu.', 'error');
            this.generateMathQuestion();
            this.mathAnswer.value = '';
            return;
        }

        // Check if this is a Netlify form
        const netlify = this.form.hasAttribute('data-netlify');
        
        if (netlify) {
            // For Netlify forms, let the default submission happen
            // Just show loading state and let Netlify handle the rest
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Odesílání...';
            
            // Don't prevent default - let Netlify handle the submission
            return;
        }
        
        // For other services, prevent default and handle manually
        e.preventDefault();
        
        // Disable submit button
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Odesílání...';

        try {
            // Check which service to use based on form action
            const action = this.form.getAttribute('action');
            
            if (action && action.includes('formspree')) {
                await this.submitFormspree();
            } else {
                await this.submitEmailto();
            }
            
            this.showStatus('Zpráva byla úspěšně odeslána! Odpovím vám co nejdříve.', 'success');
            this.form.reset();
            this.generateMathQuestion();
            
        } catch (error) {
            console.error('Chyba při odesílání formuláře:', error);
            this.showStatus('Došlo k chybě při odesílání zprávy. Prosím, zkuste to znovu nebo mě kontaktujte přímo na email.', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Odeslat zprávu';
        }
    }

    async submitFormspree() {
        // Formspree handles the submission automatically
        // Just submit the form normally
        const formData = new FormData(this.form);
        const action = this.form.getAttribute('action');
        
        const response = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Formspree submission failed');
        }
    }

    async submitEmailto() {
        // Fallback: generate mailto link
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const lessonType = formData.get('lesson-type') === 'online' ? 'Online výuka' : 'Prezenční výuka';
        const clientType = formData.get('client-type') === 'individual' ? 'Jednotlivec' : 'Firma';
        const message = formData.get('message');

        const subject = `Dotaz z webu - ${clientType}`;
        const body = `Jméno: ${name}\nEmail: ${email}\nTyp výuky: ${lessonType}\nTyp klienta: ${clientType}\n\nZpráva:\n${message}`;
        
        const mailtoLink = `mailto:kontakt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }

    showStatus(message, type) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                this.statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize rating system and contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RatingSystem();
    new ContactForm();
});
