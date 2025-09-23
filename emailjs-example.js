// EmailJS implementace pro kontaktní formulář
// Přidejte do index.html před </head>:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

class EmailJSContactForm {
    constructor() {
        // Vaše EmailJS credentials - získejte na emailjs.com
        this.publicKey = 'YOUR_PUBLIC_KEY';
        this.serviceId = 'YOUR_SERVICE_ID'; 
        this.templateId = 'YOUR_TEMPLATE_ID';
        
        emailjs.init(this.publicKey);
        
        this.form = document.getElementById('contact-form');
        this.statusDiv = document.getElementById('form-status');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Odesílání...';

        try {
            const formData = new FormData(this.form);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                lesson_type: formData.get('lesson-type'),
                client_type: formData.get('client-type'),
                message: formData.get('message')
            };

            await emailjs.send(this.serviceId, this.templateId, templateParams);
            
            this.showStatus('Zpráva byla úspěšně odeslána!', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('EmailJS error:', error);
            this.showStatus('Chyba při odesílání. Zkuste to znovu.', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Odeslat zprávu';
        }
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

// Pro použití EmailJS místo aktuální implementace, nahraďte v main.js:
// new ContactForm(); za new EmailJSContactForm();