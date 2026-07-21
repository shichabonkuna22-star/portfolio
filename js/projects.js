// =====================================================
// PROJECTS SECTION — Full JavaScript
// =====================================================

class ProjectsManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.toggleButtons = document.querySelectorAll('.project-toggle-btn');
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.setupFilterListeners();
        this.setupToggleListeners();
        this.animateProjectsOnScroll();
    }

    // ---------- FILTER ----------
    setupFilterListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
                this.setActiveButton(button);
            });
        });
    }

    filterProjects(filter) {
        this.activeFilter = filter;
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        // Animate grid
        const grid = document.querySelector('.projects-grid');
        if (grid) {
            grid.style.transform = 'scale(0.98)';
            setTimeout(() => {
                grid.style.transform = 'scale(1)';
            }, 300);
        }
    }

    setActiveButton(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // ---------- TOGGLE (See features / See less) ----------
    setupToggleListeners() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // avoid any parent click interference
                const details = button.nextElementSibling; // .project-details
                if (!details) return;

                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const newState = !isExpanded;

                // Toggle aria-expanded
                button.setAttribute('aria-expanded', newState);

                // Toggle hidden attribute on details (we use hidden to control visibility, but we use CSS transitions)
                if (newState) {
                    details.removeAttribute('hidden');
                } else {
                    details.setAttribute('hidden', '');
                }

                // Update button text
                const labelSpan = button.querySelector('.toggle-label');
                if (labelSpan) {
                    labelSpan.textContent = newState ? 'See less' : 'See features & tech stack';
                }

                // Change icon (optional: we rotate chevron via CSS)
            });
        });
    }

    // ---------- SCROLL ANIMATION ----------
    animateProjectsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    // ---------- (Optional) add new project dynamically ----------
    addProject(projectData) {
        // Not implemented in this demo, but you can extend if needed.
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});

// Export for potential use in main.js
window.ProjectsManager = ProjectsManager;