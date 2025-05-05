// Main Application Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const navToggler = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('.navbar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.querySelector('.contact-form');
    
    // Mobile Navigation
    if (navToggler && navMenu) {
        navToggler.addEventListener('click', () => {
            navToggler.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggler.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }
    
    // Project card hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
    
    // Project Modals
    if (projectCards.length) {
        projectCards.forEach(card => {
            const viewBtn = card.querySelector('.view-details-btn');
            const modal = card.querySelector('.project-modal');
            const closeBtn = modal?.querySelector('.close-modal');

            if (viewBtn && modal) {
                // Open modal
                viewBtn.addEventListener('click', () => {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });

                // Close modal
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    });
                }

                // Close when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });

                // Keyboard accessibility
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        });
    }

    // Smooth Scrolling with debounce
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    if (scrollLinks.length) {
        let scrollTimeout;
        
        scrollLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        });
    }

    // Scroll Animations with Intersection Observer
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(element => observer.observe(element));
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form submission logic here
        });
    }

    // Project Details Dropdown
    const projectButtons = document.querySelectorAll('.project-details-btn');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const details = document.getElementById(`${projectId}-details`);
            
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle active class on details
            details.classList.toggle('active');
            
            // Close other open details
            projectButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherId = otherButton.getAttribute('data-project');
                    const otherDetails = document.getElementById(`${otherId}-details`);
                    otherButton.classList.remove('active');
                    otherDetails.classList.remove('active');
                }
            });
        });
    });

    // Cleanup function
    return () => {
        if (navToggler) {
            navToggler.removeEventListener('click');
        }
        if (navLinks.length) {
            navLinks.forEach(link => link.removeEventListener('click'));
        }
        if (scrollLinks.length) {
            scrollLinks.forEach(link => link.removeEventListener('click'));
        }
        if (contactForm) {
            contactForm.removeEventListener('submit');
        }
    };
});