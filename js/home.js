// Home Section Animations and Interactions
class HomeAnimations {
    constructor() {
        this.typingElements = document.querySelectorAll('.typing-text');
        this.floatingElements = document.querySelectorAll('.floating-element');
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.setupTypingAnimation();
        this.setupScrollAnimation();
        this.setupStatsCounter();
        this.setupParallaxEffect();
        this.setupButtonInteractions();
        this.setupCVTracking(); // Added this line
    }

    createFloatingElements() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        
        // Create multiple floating elements
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            floatingContainer.appendChild(element);
        }
        
        document.querySelector('.home').appendChild(floatingContainer);
    }

    setupTypingAnimation() {
        this.typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupScrollAnimation() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = `
            <div class="scroll-text">Scroll Down</div>
            <div class="scroll-arrow"></div>
        `;
        
        document.querySelector('.home').appendChild(scrollIndicator);

        // Hide scroll indicator when scrolling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    setupStatsCounter() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.home-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.round(current);
            }, 16);
        });
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Magnetic effect
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                this.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
            });
        });
    }

    // CV Tracking
    setupCVTracking() {
        const cvButton = document.querySelector('a[href*="Shichabo-Nkuna-CV.pdf"]');
        if (cvButton) {
            cvButton.addEventListener('click', () => {
                // You can add analytics tracking here
                console.log('CV viewed/downloaded');
                
                // Optional: Show a confirmation message
                this.showCVConfirmation();
            });
        }
    }

    showCVConfirmation() {
        // Create a temporary confirmation message
        const confirmation = document.createElement('div');
        confirmation.textContent = 'Opening CV...';
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(confirmation);
            }, 300);
        }, 2000);
    }

    // Particle system for background
    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '0'
        });
        
        document.querySelector('.home').appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(135, 206, 235, ${Math.random() * 0.3})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        // Initialize
        resizeCanvas();
        initParticles();
        animateParticles();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // Add CSS for ripple animation
    addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize home animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homeAnimations = new HomeAnimations();
    homeAnimations.addRippleStyles();
    homeAnimations.createParticleSystem();
});

// Export for use in main.js
window.HomeAnimations = HomeAnimations;

// Additional utility functions for home section
const HomeUtils = {
    // Preload images for better performance
    preloadImages: function() {
        const images = [
            'images/home-1.jpeg',
            'images/logo-1.jpeg',
            'documents/Sechabo_CV.pdf' // Preload CV too
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    },

    // Handle responsive behavior
    handleResponsive: function() {
        const homeSection = document.querySelector('.home');
        const updateLayout = () => {
            if (window.innerWidth < 768) {
                homeSection.classList.add('mobile-view');
            } else {
                homeSection.classList.remove('mobile-view');
            }
        };

        window.addEventListener('resize', updateLayout);
        updateLayout();
    },

    // Add intersection observer for elements
    observeElements: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });

        // Observe home section elements
        document.querySelectorAll('.home-content > *').forEach(el => {
            observer.observe(el);
        });
    }
};

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    HomeUtils.preloadImages();
    HomeUtils.handleResponsive();
    HomeUtils.observeElements();
});