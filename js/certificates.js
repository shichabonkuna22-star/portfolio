// Certificates Section Functionality
class CertificatesManager {
    constructor() {
        this.modal = document.getElementById('certificateModal');
        this.certificates = {
            'networking-basics': 'documents/Networking_Basics_certificate.pdf',
            'networking-devices': 'documents/Networking_Devices_and_Initial_Configuration_certificate.pdf',
            'network-addressing': 'documents/Network_Addressing_and_Basic_Troubleshooting_certificate.pdf',
            'network-support': 'documents/Network_Support_and_Security_certificate.pdf',
            'network-technician': 'documents/Network_Technician_Career_Path_certificate.pdf',
            'oci-foundations': 'documents/Oracle_Cloud_Infrastructure_2025_Certified_Foundations_Associate_Certificate.pdf',
            'oci-ai': 'documents/Oracle_Cloud_Infrastructure_2025_Certified_AI_Foundations_Associate_Certificate.pdf',
            'oci-architect': 'documents/Certified_Architect_Associate_Certificate.pdf',
            'oci-migration': 'documents/Migration_Architect_Certified_Professional_Certificate.pdf'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateCertificatesOnScroll();
    }

    setupEventListeners() {
        // View certificate buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-certificate') || 
                e.target.closest('.view-certificate')) {
                const button = e.target.classList.contains('view-certificate') ? 
                    e.target : e.target.closest('.view-certificate');
                const certId = button.getAttribute('data-cert');
                this.viewCertificate(certId);
            }
        });

        // Modal close buttons
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Download button
        this.modal.querySelector('.download-btn').addEventListener('click', () => {
            this.downloadCertificate();
        });

        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    viewCertificate(certId) {
        const certificatePath = this.certificates[certId];
        if (certificatePath) {
            const modalTitle = this.modal.querySelector('#modalTitle');
            const certificateName = document.querySelector(`[data-cert="${certId}"]`).closest('.certificate-item').querySelector('h4').textContent;
            modalTitle.textContent = certificateName;
            
            // Display PDF in modal
            const viewer = document.getElementById('certificateViewer');
            viewer.innerHTML = `
                <iframe src="${certificatePath}" width="100%" height="100%" style="border: none;">
                    Your browser does not support PDFs. 
                    <a href="${certificatePath}" target="_blank">Download the PDF</a>.
                </iframe>
            `;
            
            // Store current certificate for download
            this.currentCertificate = {
                path: certificatePath,
                name: certificateName
            };
            
            this.openModal();
        } else {
            console.error('Certificate not found:', certId);
        }
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear the iframe to stop any ongoing processes
        const viewer = document.getElementById('certificateViewer');
        viewer.innerHTML = '';
    }

    downloadCertificate() {
        if (this.currentCertificate) {
            const link = document.createElement('a');
            link.href = this.currentCertificate.path;
            link.download = `${this.currentCertificate.name.replace(/\s+/g, '_')}.pdf`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showDownloadToast(this.currentCertificate.name);
        }
    }

    showDownloadToast(certName) {
        const toast = document.createElement('div');
        toast.className = 'download-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Downloading ${certName}</span>
        `;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#28a745',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '3000',
            animation: 'slideInRight 0.3s ease-out'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    animateCertificatesOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.certificate-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Add CSS for animations
const certificateStyles = document.createElement('style');
certificateStyles.textContent = `
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
    
    .certificate-item {
        opacity: 0;
    }
`;
document.head.appendChild(certificateStyles);

// Initialize certificates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificatesManager();
});

// Export for use in main.js
window.CertificatesManager = CertificatesManager;