// Gallery Section Functionality
class GalleryManager {
    constructor() {
        this.galleryItems = [];
        this.lightbox = null;
        this.currentIndex = 0;
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.createLightbox();
        this.setupEventListeners();
        this.loadGalleryItems();
        this.animateGalleryOnScroll();
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'gallery-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption">
                    <h4 class="lightbox-title"></h4>
                    <p class="lightbox-description"></p>
                </div>
                <div class="lightbox-nav">
                    <button class="lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.lightbox);

        // Lightbox events
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            this.previousImage();
        });

        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            this.nextImage();
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.gallery-btn').forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
                this.setActiveFilterButton(button);
            });
        });

        // Gallery item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                const item = e.target.closest('.gallery-item');
                const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item);
                this.openLightbox(index);
            }
        });
    }

    loadGalleryItems() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item')).map(item => {
            return {
                image: item.getAttribute('data-image') || item.querySelector('img')?.src,
                title: item.getAttribute('data-title') || 'Gallery Image',
                description: item.getAttribute('data-description') || '',
                category: item.getAttribute('data-category') || 'all'
            };
        });
    }

    filterGallery(filter) {
        this.activeFilter = filter;
        
        document.querySelectorAll('.gallery-item').forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    setActiveFilterButton(activeButton) {
        document.querySelectorAll('.gallery-btn').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    openLightbox(index) {
        this.currentIndex = index;
        const item = this.galleryItems[index];
        
        if (item) {
            const lightbox = this.lightbox;
            lightbox.querySelector('.lightbox-image').src = item.image;
            lightbox.querySelector('.lightbox-title').textContent = item.title;
            lightbox.querySelector('.lightbox-description').textContent = item.description;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.updateLightboxImage();
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const item = this.galleryItems[this.currentIndex];
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        const lightboxDescription = this.lightbox.querySelector('.lightbox-description');

        // Add fade out effect
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = item.image;
            lightboxTitle.textContent = item.title;
            lightboxDescription.textContent = item.description;
            lightboxImage.style.opacity = '1';
        }, 200);
    }

    animateGalleryOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'galleryItemAppear 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.gallery-item').forEach(item => {
            observer.observe(item);
        });
    }

    // Method to add new gallery items dynamically
    addGalleryItem(itemData) {
        const grid = document.querySelector('.gallery-grid');
        const galleryItem = this.createGalleryItem(itemData);
        grid.appendChild(galleryItem);
        
        // Reload gallery items and re-initialize animations
        this.loadGalleryItems();
        this.animateGalleryOnScroll();
    }

    createGalleryItem(item) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.setAttribute('data-title', item.title);
        galleryItem.setAttribute('data-description', item.description);
        
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-overlay">
                    <div class="gallery-overlay-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <button class="zoom-btn">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return galleryItem;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});

// Export for use in main.js
window.GalleryManager = GalleryManager;