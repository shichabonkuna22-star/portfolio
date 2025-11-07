// About Section Animations and Interactions
class AboutAnimations {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.aboutImage = document.querySelector('.about-img');
        this.observer = null;
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.setupSkillAnimations();
        this.setupImageInteractions();
        this.setupScrollAnimations();
        this.setupEducationHover();
        this.setupCommunityHover();
    }

    createFloatingElements() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'about-floating-elements';
        
        // Create floating shapes
        const shapes = [
            { className: 'about-floating about-floating-1', emoji: '💻' },
            { className: 'about-floating about-floating-2', emoji: '🚀' },
            { className: 'about-floating about-floating-3', emoji: '🌟' }
        ];

        shapes.forEach(shape => {
            const element = document.createElement('div');
            element.className = shape.className;
            element.innerHTML = `<span style="font-size: 2rem; opacity: 0.1;">${shape.emoji}</span>`;
            floatingContainer.appendChild(element);
        });

        document.querySelector('.about').appendChild(floatingContainer);
    }

    setupSkillAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    this.observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '-50px'
        });

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            this.observer.observe(aboutSection);
        }
    }

    animateSkills() {
        // Animate skill items with staggered delay
        this.skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 150);
        });

        // Animate skill bars
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-width');
                if (targetWidth) {
                    bar.style.width = targetWidth;
                    
                    // Animate percentage counter
                    const percentageElement = bar.closest('.skill-item').querySelector('.skill-percentage');
                    if (percentageElement) {
                        this.animateCounter(percentageElement, parseInt(targetWidth));
                    }
                }
            }, index * 200 + 500);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 30; // Adjust speed
        const duration = 1500; // 1.5 seconds
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `${Math.round(current)}%`;
        }, duration / (target / increment));
    }

    setupImageInteractions() {
        if (this.aboutImage) {
            // Tilt effect on mouse move
            this.aboutImage.addEventListener('mousemove', (e) => {
                const rect = this.aboutImage.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                this.aboutImage.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-10px) 
                    scale(1.02)
                `;
            });

            this.aboutImage.addEventListener('mouseleave', () => {
                this.aboutImage.style.transform = 'translateY(0) scale(1)';
                setTimeout(() => {
                    this.aboutImage.style.transform = '';
                }, 300);
            });

            // Click to enlarge (optional)
            this.aboutImage.addEventListener('click', () => {
                this.showImageModal();
            });
        }
    }

    showImageModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;

        const img = document.createElement('img');
        img.src = this.aboutImage.src;
        img.alt = this.aboutImage.alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: scaleIn 0.3s ease;
        `;

        modal.appendChild(img);
        document.body.appendChild(modal);

        // Close modal on click
        modal.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        // Add CSS for animations
        this.addModalStyles();
    }

    addModalStyles() {
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px'
        };

        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInLeft 0.8s ease-out forwards';
                    textObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInRight 0.8s ease-out forwards';
                    imageObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe text elements
        document.querySelectorAll('.about-text > *').forEach(el => {
            textObserver.observe(el);
        });

        // Observe image
        if (this.aboutImage) {
            imageObserver.observe(this.aboutImage);
        }
    }

    setupEducationHover() {
        const educationInfo = document.querySelector('.education-info');
        if (educationInfo) {
            educationInfo.addEventListener('mouseenter', () => {
                educationInfo.style.background = 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)';
            });

            educationInfo.addEventListener('mouseleave', () => {
                educationInfo.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            });
        }
    }

    setupCommunityHover() {
        const communitySection = document.querySelector('.community-engagement');
        if (communitySection) {
            communitySection.addEventListener('mouseenter', () => {
                communitySection.style.background = 'linear-gradient(135deg, rgba(30, 144, 255, 0.1) 0%, rgba(135, 206, 235, 0.15) 100%)';
            });

            communitySection.addEventListener('mouseleave', () => {
                communitySection.style.background = 'linear-gradient(135deg, rgba(30, 144, 255, 0.05) 0%, rgba(135, 206, 235, 0.1) 100%)';
            });
        }
    }

    // Method to update skills dynamically
    updateSkill(skillName, newPercentage) {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const nameElement = item.querySelector('.skill-name');
            if (nameElement.textContent.includes(skillName)) {
                const progressBar = item.querySelector('.skill-progress');
                const percentageElement = item.querySelector('.skill-percentage');
                
                progressBar.setAttribute('data-width', `${newPercentage}%`);
                percentageElement.textContent = `${newPercentage}%`;
                
                // Re-animate if in view
                if (item.classList.contains('animate')) {
                    progressBar.style.width = `${newPercentage}%`;
                }
            }
        });
    }
}

// Initialize about animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutAnimations();
});

// Export for use in main.js
window.AboutAnimations = AboutAnimations;

// Utility functions for about section
const AboutUtils = {
    // Preload about image
    preloadAboutImage: function() {
        const aboutImage = document.querySelector('.about-img');
        if (aboutImage) {
            const img = new Image();
            img.src = aboutImage.src;
        }
    },

    // Add smooth scroll to about section
    scrollToAbout: function() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Update education status
    updateEducationStatus: function(newStatus, newGraduationDate) {
        const statusElement = document.querySelector('.education-status');
        const graduationElement = document.querySelector('.education-info > p');
        
        if (statusElement && newStatus) {
            statusElement.textContent = newStatus;
        }
        
        if (graduationElement && newGraduationDate) {
            graduationElement.textContent = `Graduating: ${newGraduationDate} | Outstanding Academic Performance`;
        }
    }
};

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    AboutUtils.preloadAboutImage();
});

// Add global method to update skills from console (for testing)
window.updateSkill = (skillName, percentage) => {
    const aboutAnimations = new AboutAnimations();
    aboutAnimations.updateSkill(skillName, percentage);
};