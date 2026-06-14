// Gallery Section Functionality
class GalleryManager {
    constructor() {
        this.galleryItems = [];
        this.lightbox = null;
        this.currentIndex = 0;

        // graduation slider state
        this.itemStates = new Map();

        this.init();
    }

    init() {
        this.createLightbox();
        this.setupEventListeners();
        this.loadGalleryItems();
        this.initCardSlideshows();
    }

    /* ================= LIGHTBOX ================= */

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'gallery-lightbox';

        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="">
                <div class="lightbox-caption">
                    <h4 class="lightbox-title"></h4>
                    <p class="lightbox-description"></p>
                </div>
                <div class="lightbox-nav">
                    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;

        document.body.appendChild(this.lightbox);

        this.lightbox.querySelector('.lightbox-close')
            .addEventListener('click', () => this.closeLightbox());

        this.lightbox.querySelector('.lightbox-prev')
            .addEventListener('click', () => this.previousImage());

        this.lightbox.querySelector('.lightbox-next')
            .addEventListener('click', () => this.nextImage());

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }

    /* ================= SETUP ================= */

    setupEventListeners() {
        // zoom button opens lightbox
        document.addEventListener('click', (e) => {
            if (e.target.closest('.zoom-btn')) {
                const item = e.target.closest('.gallery-item');
                this.openLightbox(item);
            }
        });

        // arrow buttons open lightbox and update image
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.gallery-slide-btn');
            if (!btn) return;

            const item = btn.closest('.gallery-item');
            const direction = btn.classList.contains('prev') ? 'prev' : 'next';
            
            // First update the card image
            this.changeCardImage(item, direction);
            
            // THEN open lightbox with the NEWLY selected image
            setTimeout(() => {
                this.openLightbox(item);
            }, 50);
        });
    }

    /* ================= LOAD ================= */

    loadGalleryItems() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item')).map(item => ({
            element: item,
            title: item.dataset.title,
            description: item.dataset.description,
            images: this.getImages(item),
            defaultImage: this.getDefaultImage(item)
        }));
    }

    getImages(item) {
        const main = item.querySelector('.gallery-image img')?.src;

        const extras = Array.from(item.querySelectorAll('.extra-images img'))
            .map(img => img.src);

        return [main, ...extras].filter(Boolean);
    }

    getDefaultImage(item) {
        // For graduation item, always return the original H.shake-cropped.jpg
        if (item.classList.contains('graduation-item')) {
            return 'images/Grad/H.shake-cropped.jpg';
        }
        // For other items, return the first image in their gallery
        const firstImg = item.querySelector('.gallery-image img')?.src;
        return firstImg || '';
    }

    /* ================= RESET TO DEFAULT ================= */

    resetToDefaultImage(item) {
        const defaultImg = this.getDefaultImage(item);
        if (!defaultImg) return;

        // Reset the card image to default
        const img = item.querySelector('.gallery-image img');
        img.src = defaultImg;

        // Reset the slider state index
        const state = this.itemStates.get(item);
        if (state) {
            // Find the index of the default image in the images array
            const defaultIndex = state.images.indexOf(defaultImg);
            state.index = defaultIndex >= 0 ? defaultIndex : 0;
        }

        // Clear the active image tracking
        delete item.dataset.activeImage;
    }

    /* ================= CARD SLIDER ================= */

    initCardSlideshows() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            const images = this.getImages(item);
            if (images.length <= 1) return;

            this.itemStates.set(item, {
                index: 0,
                images
            });

            const imgWrap = item.querySelector('.gallery-image');

            if (!imgWrap.querySelector('.gallery-slide-btn')) {
                imgWrap.insertAdjacentHTML('beforeend', `
                    <button class="gallery-slide-btn prev" data-dir="prev">‹</button>
                    <button class="gallery-slide-btn next" data-dir="next">›</button>
                `);
            }
        });
    }

    changeCardImage(item, direction) {
        const state = this.itemStates.get(item);
        if (!state) return;

        if (direction === 'next') {
            state.index = (state.index + 1) % state.images.length;
        } else {
            state.index = (state.index - 1 + state.images.length) % state.images.length;
        }

        const img = item.querySelector('.gallery-image img');
        img.src = state.images[state.index];

        // store current image for lightbox sync
        item.dataset.activeImage = img.src;
    }

    /* ================= LIGHTBOX ================= */

    openLightbox(item) {
        const images = this.getImages(item);

        // get current displayed image (from slider)
        let activeImg = item.dataset.activeImage;
        
        // fallback to main image if no active image stored
        if (!activeImg) {
            activeImg = item.querySelector('.gallery-image img').src;
        }

        this.currentIndex = images.indexOf(activeImg);
        if (this.currentIndex < 0) this.currentIndex = 0;

        this.activeItem = item;
        this.activeImages = images;

        this.renderLightbox();

        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderLightbox() {
        const img = this.activeImages[this.currentIndex];

        this.lightbox.querySelector('.lightbox-image').src = img;
        this.lightbox.querySelector('.lightbox-title').textContent =
            this.activeItem.dataset.title || 'Gallery Image';

        this.lightbox.querySelector('.lightbox-description').textContent =
            this.activeItem.dataset.description || '';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // IMPORTANT: Reset the gallery item to default image when lightbox closes
        if (this.activeItem) {
            this.resetToDefaultImage(this.activeItem);
        }
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.activeImages.length;
        this.renderLightbox();
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.activeImages.length) % this.activeImages.length;
        this.renderLightbox();
    }
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});