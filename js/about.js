// =====================================================
// ADDITIONAL TECHNICAL SKILLS TOGGLE FUNCTIONALITY
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('additionalSkillsToggle');
    const content = document.getElementById('additionalSkillsContent');

    if (toggleBtn && content) {
        // Set initial state: collapsed
        content.classList.remove('open');

        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            if (!isExpanded) {
                // Expand
                content.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.toggle-text').innerHTML =
                    '<i class="fas fa-minus-circle"></i> See Less';
            } else {
                // Collapse
                content.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.toggle-text').innerHTML =
                    '<i class="fas fa-plus-circle"></i> See Additional Technical Skills';
            }
        });
    }
});

// =====================================================
// ADDITIONAL TECHNOLOGY STACK & TOOLS TOGGLE
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('additionalTechStackToggle');
    const content = document.getElementById('additionalTechStackContent');

    if (toggleBtn && content) {
        // Ensure it starts collapsed
        content.classList.remove('open');

        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            if (!isExpanded) {
                // Expand
                content.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.toggle-text').innerHTML =
                    '<i class="fas fa-minus-circle"></i> See Less';
            } else {
                // Collapse
                content.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.toggle-text').innerHTML =
                    '<i class="fas fa-plus-circle"></i> See Additional Technology Stack & Tools';
            }
        });
    }
});

// =====================================================
// About Section Animations and Interactions
// =====================================================
class AboutAnimations {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.aboutImage = document.querySelector('.about-img');
        this.hasAnimated = false;
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

        const shapes = [
            { className: 'about-floating about-floating-1', emoji: '💻', top: '20%', left: '10%' },
            { className: 'about-floating about-floating-2', emoji: '🚀', top: '60%', left: '80%' },
            { className: 'about-floating about-floating-3', emoji: '🌟', top: '80%', left: '15%' }
        ];

        shapes.forEach(shape => {
            const element = document.createElement('div');
            element.className = shape.className;
            element.style.top = shape.top;
            element.style.left = shape.left;
            element.innerHTML = shape.emoji;
            floatingContainer.appendChild(element);
        });

        aboutSection.style.position = 'relative';
        aboutSection.appendChild(floatingContainer);
    }

    setupSkillAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
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

        const skillsContainer = document.querySelector('.skills-container');
        const aboutSection = document.getElementById('about');

        if (skillsContainer) {
            observer.observe(skillsContainer);
        } else if (aboutSection) {
            observer.observe(aboutSection);
        }
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-width');

                if (targetWidth) {
                    bar.style.setProperty('--target-width', targetWidth);
                    bar.classList.add('animated');

                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 10);

                    const skillItem = bar.closest('.skill-item');
                    if (skillItem) {
                        const percentageElement = skillItem.querySelector('.skill-percentage');
                        if (percentageElement) {
                            const targetValue = parseInt(targetWidth);
                            this.animateCounter(percentageElement, targetValue);
                        }
                    }
                }
            }, index * 200 + 300);
        });

        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150 + 800);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16);

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

        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        if (!isTouchDevice) {
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
            this.aboutImage.style.cursor = 'pointer';
        }

        this.aboutImage.addEventListener('click', () => {
            this.showImageModal();
        });
    }

    showImageModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.setAttribute('aria-label', 'Enlarged image');
        modal.setAttribute('role', 'dialog');

        const img = document.createElement('img');
        img.src = this.aboutImage.src;
        img.alt = this.aboutImage.alt || 'About Me';

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

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape' && modal.parentNode) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        });
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

        document.querySelectorAll('.about-text > *').forEach(el => {
            textObserver.observe(el);
        });

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
    preloadAboutImage: function() {
        const aboutImage = document.querySelector('.about-img');
        if (aboutImage) {
            const img = new Image();
            img.src = aboutImage.src;
        }
    },

    scrollToAbout: function() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    updateEducationStatus: function(newStatus, newGraduationDate) {
        const statusElement = document.querySelector('.education-status');
        const graduationElement = document.querySelector('.education-info > p');

        if (statusElement && newStatus) {
            statusElement.textContent = newStatus;
        }

        if (graduationElement && newGraduationDate) {
            graduationElement.innerHTML = `<i class="fas fa-calendar-alt"></i> Graduating: ${newGraduationDate} | Outstanding Academic Performance`;
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

// =====================================================
// VIEW MORE PROJECTS FUNCTIONALITY
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    let showingAll = false;

    function getVisibleProjects() {
        const allCards = document.querySelectorAll('.project-card');
        return Array.from(allCards).filter(card => {
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
        setTimeout(updateView, 100);

        viewMoreBtn.addEventListener('click', function() {
            const visibleProjects = getVisibleProjects();
            const initialVisibleCount = 3;

            if (!showingAll) {
                showingAll = true;
                updateView();

                if (visibleProjects[initialVisibleCount]) {
                    setTimeout(() => {
                        visibleProjects[initialVisibleCount].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 300);
                }
            } else {
                const projectsToHide = visibleProjects.slice(initialVisibleCount);

                projectsToHide.forEach((project, index) => {
                    project.style.animation = 'fadeOut 0.4s ease-out forwards';
                });

                setTimeout(() => {
                    showingAll = false;
                    updateView();
                    viewMoreBtn.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 400);
            }
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            showingAll = false;
            setTimeout(updateView, 50);
        });
    });
});

// =====================================================
// MOBILE FEATURES TOGGLE FUNCTIONALITY
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const featureToggles = document.querySelectorAll('.features-toggle');

    featureToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const featuresContent = this.closest('.project-features').querySelector('.features-content');
            const isExpanded = featuresContent.classList.contains('expanded');

            featuresContent.classList.toggle('expanded');
            this.classList.toggle('expanded');

            this.setAttribute('aria-expanded', !isExpanded);

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

    function handleResponsiveFeatures() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const allFeaturesContent = document.querySelectorAll('.features-content');
        const allToggles = document.querySelectorAll('.features-toggle');

        if (!isMobile) {
            allFeaturesContent.forEach(content => {
                content.classList.add('expanded');
                content.style.maxHeight = 'none';
                content.style.opacity = '1';
            });
            allToggles.forEach(toggle => {
                toggle.style.display = 'none';
            });
        } else {
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

    handleResponsiveFeatures();
    window.addEventListener('resize', handleResponsiveFeatures);
});

// =====================================================
// FIX FOR PROGRESS BARS - ENSURE THEY ANIMATE ON PAGE LOAD
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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

// =====================================================
// SKILL PERCENTAGE UPDATE FUNCTION (GLOBAL)
// =====================================================
function updateSkillPercentage(skillName, newPercentage) {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const nameElement = item.querySelector('.skill-name');
        if (nameElement && nameElement.textContent.includes(skillName)) {
            const progressBar = item.querySelector('.skill-progress');
            const percentageElement = item.querySelector('.skill-percentage');

            if (progressBar) {
                progressBar.setAttribute('data-width', `${newPercentage}%`);
                progressBar.style.setProperty('--target-width', `${newPercentage}%`);
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

window.updateSkillPercentage = updateSkillPercentage;

console.log('✅ About section updated:');
console.log('✅ Additional Technical Skills toggle (centered, short)');
console.log('✅ Technology Stack & Tools: static heading, 3 visible cards, Additional toggle for remaining 4');