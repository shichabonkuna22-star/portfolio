// Projects Section Functionality
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateProjectsOnScroll();
    }

    setupEventListeners() {
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

        // Animate layout change
        this.animateLayout();
    }

    setActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    animateLayout() {
        const grid = document.querySelector('.projects-grid');
        grid.style.transform = 'scale(0.98)';
        setTimeout(() => {
            grid.style.transform = 'scale(1)';
        }, 300);
    }

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

    // Method to add new projects dynamically
    addProject(projectData) {
        const grid = document.querySelector('.projects-grid');
        const projectCard = this.createProjectCard(projectData);
        grid.appendChild(projectCard);
        
        // Re-initialize animations for new card
        this.animateProjectsOnScroll();
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        
        card.innerHTML = `
            <div class="project-image">
                <i class="${project.icon}"></i>
                <div class="project-overlay">
                    <a href="${project.liveLink}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="${project.githubLink}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                ${project.features ? `
                <div class="project-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsFilter();
});

// Export for use in main.js
window.ProjectsFilter = ProjectsFilter;