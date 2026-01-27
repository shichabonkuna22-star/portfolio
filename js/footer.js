// Footer Functionality
class FooterManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackToTop();
        this.setupSmoothScroll();
        this.animateFooterOnScroll();
    }

    setupBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupSmoothScroll() {
        const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    animateFooterOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });

        // Observe footer sections
        const footerSections = document.querySelectorAll('.footer-brand, .footer-links, .footer-skills, .footer-contact');
        footerSections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            observer.observe(section);
        });
    }

    // Method to update copyright year automatically
    updateCopyrightYear() {
        const copyrightElement = document.querySelector('.footer-bottom p');
        if (copyrightElement) {
            const currentYear = new Date().getFullYear();
            copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
        }
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const footerManager = new FooterManager();
    footerManager.updateCopyrightYear();
});

// Add CSS animations for footer
const footerStyles = document.createElement('style');
footerStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(footerStyles);

// Export for use in main.js
window.FooterManager = FooterManager;