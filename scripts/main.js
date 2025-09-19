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

// Initialize rating system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RatingSystem();
});
