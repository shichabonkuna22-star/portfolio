// About Section Animations and Interactions
class AboutAnimations {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.aboutImage = document.querySelector('.about-img');
        this.hasAnimated = false; // Prevent multiple animations
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
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'about-floating-elements';
        floatingContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        const shapes = [
            { className: 'about-floating about-floating-1', emoji: '💻', top: '20%', left: '10%' },
            { className: 'about-floating about-floating-2', emoji: '🚀', top: '60%', left: '80%' },
            { className: 'about-floating about-floating-3', emoji: '🌟', top: '80%', left: '15%' }
        ];

        shapes.forEach(shape => {
            const element = document.createElement('div');
            element.className = shape.className;
            element.style.cssText = `
                position: absolute;
                top: ${shape.top};
                left: ${shape.left};
                font-size: 2rem;
                opacity: 0.1;
                animation: float 6s ease-in-out infinite;
            `;
            element.innerHTML = shape.emoji;
            floatingContainer.appendChild(element);
        });

        aboutSection.style.position = 'relative';
        aboutSection.appendChild(floatingContainer);
        
        // Add float animation
        if (!document.querySelector('#float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupSkillAnimations() {
        // Use IntersectionObserver to detect when skills section is visible
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the element is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe the skills container or about section
        const skillsContainer = document.querySelector('.skills-container');
        const aboutSection = document.getElementById('about');
        
        if (skillsContainer) {
            observer.observe(skillsContainer);
        } else if (aboutSection) {
            observer.observe(aboutSection);
        }
    }

    animateSkills() {
        // Animate progress bars with staggered delay - FIXED
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-width');
                
                if (targetWidth) {
                    // Set CSS custom property for the target width
                    bar.style.setProperty('--target-width', targetWidth);
                    
                    // Add the animated class to trigger CSS transition
                    bar.classList.add('animated');
                    
                    // FIX: Use setTimeout to ensure CSS transition triggers
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 10);
                    
                    // Animate the percentage counter
                    const skillItem = bar.closest('.skill-item');
                    if (skillItem) {
                        const percentageElement = skillItem.querySelector('.skill-percentage');
                        if (percentageElement) {
                            // Extract number from target width (e.g., "85%" -> 85)
                            const targetValue = parseInt(targetWidth);
                            this.animateCounter(percentageElement, targetValue);
                        }
                    }
                }
            }, index * 200 + 300); // 300ms initial delay, then 200ms stagger
        });

        // Animate skill cards with staggered delay
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150 + 800); // Start after progress bars
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const duration = 1500; // 1.5 seconds
        const increment = target / (duration / 16); // 60fps
        
        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                current = target;
                element.textContent = `${Math.round(current)}%`;
                return;
            }
            element.textContent = `${Math.round(current)}%`;
            requestAnimationFrame(updateCounter);
        };
        
        requestAnimationFrame(updateCounter);
    }

    setupImageInteractions() {
        if (!this.aboutImage) return;

        // Check if touch device
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        
        if (!isTouchDevice) {
            // Tilt effect on mouse move (desktop only)
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
        } else {
            // Mobile: Add click to enlarge functionality
            this.aboutImage.style.cursor = 'pointer';
        }

        // Click to enlarge (works on both mobile and desktop)
        this.aboutImage.addEventListener('click', () => {
            this.showImageModal();
        });
    }

    showImageModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
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
            padding: 1rem;
            box-sizing: border-box;
        `;

        const img = document.createElement('img');
        img.src = this.aboutImage.src;
        img.alt = this.aboutImage.alt;
        img.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: scaleIn 0.3s ease;
            object-fit: contain;
        `;

        modal.appendChild(img);
        document.body.appendChild(modal);

        modal.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        });

        this.addModalStyles();
    }

    addModalStyles() {
        if (document.querySelector('#modal-styles')) return;
        
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
            if (nameElement && nameElement.textContent.includes(skillName)) {
                const progressBar = item.querySelector('.skill-progress');
                const percentageElement = item.querySelector('.skill-percentage');
                
                if (progressBar) {
                    progressBar.setAttribute('data-width', `${newPercentage}%`);
                    progressBar.style.setProperty('--target-width', `${newPercentage}%`);
                    // If already animated, update immediately
                    if (progressBar.classList.contains('animated')) {
                        progressBar.style.width = `${newPercentage}%`;
                    }
                }
                
                if (percentageElement) {
                    percentageElement.textContent = `${newPercentage}%`;
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

// View More Projects functionality - SINGLE INSTANCE ONLY
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    let showingAll = false; // Single source of truth
    
    // Function to get currently visible/filtered projects
    function getVisibleProjects() {
        // Get projects that are not hidden by filters (those with display: none from filtering)
        const allCards = document.querySelectorAll('.project-card');
        return Array.from(allCards).filter(card => {
            // Check if card is filtered out (filters usually add display:none inline or hide class)
            return card.style.display !== 'none' && !card.classList.contains('filter-hide');
        });
    }
    
    function updateView() {
        const visibleProjects = getVisibleProjects();
        const initialVisibleCount = 3;
        
        if (visibleProjects.length <= initialVisibleCount) {
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
            return;
        } else {
            if (viewMoreBtn) viewMoreBtn.style.display = 'inline-flex';
        }
        
        if (!showingAll) {
            // Hide projects beyond first 3
            visibleProjects.forEach((project, index) => {
                if (index >= initialVisibleCount) {
                    project.classList.remove('visible');
                    project.classList.add('hidden');
                    project.style.animation = '';
                } else {
                    project.classList.add('visible');
                    project.classList.remove('hidden');
                }
            });
            
            viewMoreBtn.innerHTML = `<i class="fas fa-arrow-down"></i> View More Projects (${visibleProjects.length - initialVisibleCount} More)`;
            viewMoreBtn.classList.remove('active');
        } else {
            // Show all projects with animation
            visibleProjects.forEach((project, index) => {
                if (index >= initialVisibleCount) {
                    project.classList.remove('hidden');
                    project.classList.add('visible');
                    setTimeout(() => {
                        project.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    }, (index - initialVisibleCount) * 100);
                }
            });
            
            viewMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Projects';
            viewMoreBtn.classList.add('active');
        }
    }
    
    if (viewMoreBtn) {
        // Initialize state
        updateView();
        
        viewMoreBtn.addEventListener('click', function() {
            const visibleProjects = getVisibleProjects();
            const initialVisibleCount = 3;
            
            if (!showingAll) {
                // Show all
                showingAll = true;
                updateView();
                
                // Scroll to first hidden project
                if (visibleProjects[initialVisibleCount]) {
                    setTimeout(() => {
                        visibleProjects[initialVisibleCount].scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
            } else {
                // Hide extra projects with fade out animation
                const projectsToHide = visibleProjects.slice(initialVisibleCount);
                
                projectsToHide.forEach((project, index) => {
                    project.style.animation = 'fadeOut 0.4s ease-out forwards';
                });
                
                // Wait for animation to finish before hiding
                setTimeout(() => {
                    showingAll = false;
                    updateView();
                    
                    // Scroll back to button
                    viewMoreBtn.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 400);
            }
        });
    }
    
    // Handle filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset state when filtering
            showingAll = false;
            // Small delay to let filter logic run first
            setTimeout(updateView, 50);
        });
    });
});

// Mobile Features Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const featureToggles = document.querySelectorAll('.features-toggle');
    
    featureToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const featuresContent = this.closest('.project-features').querySelector('.features-content');
            const isExpanded = featuresContent.classList.contains('expanded');
            
            // Toggle expanded class
            featuresContent.classList.toggle('expanded');
            this.classList.toggle('expanded');
            
            // Update ARIA attribute
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Update icon
            const icon = this.querySelector('i');
            if (isExpanded) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
    
    // Auto-expand features on desktop
    function handleResponsiveFeatures() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const allFeaturesContent = document.querySelectorAll('.features-content');
        const allToggles = document.querySelectorAll('.features-toggle');
        
        if (!isMobile) {
            // Desktop: expand all
            allFeaturesContent.forEach(content => {
                content.classList.add('expanded');
                content.style.maxHeight = 'none';
                content.style.opacity = '1';
            });
            allToggles.forEach(toggle => {
                toggle.style.display = 'none';
            });
        } else {
            // Mobile: collapse all
            allFeaturesContent.forEach(content => {
                content.classList.remove('expanded');
                content.style.maxHeight = '0';
                content.style.opacity = '0';
            });
            allToggles.forEach(toggle => {
                toggle.style.display = 'block';
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            });
        }
    }
    
    // Initial setup
    handleResponsiveFeatures();
    
    // Update on resize
    window.addEventListener('resize', handleResponsiveFeatures);
});

// Fix for progress bars - ensure they animate on page load
document.addEventListener('DOMContentLoaded', function() {
    // Force reflow to trigger animation
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger skill animations
                    const aboutAnimations = new AboutAnimations();
                    setTimeout(() => {
                        aboutAnimations.animateSkills();
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsContainer);
    }
});