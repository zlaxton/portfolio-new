// Main Application Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const navToggler = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('.navbar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.querySelector('.contact-form');
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Update scroll progress with debounce
    const updateScrollProgress = debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
    }, 10);

    window.addEventListener('scroll', updateScrollProgress);

    // Intersection Observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation is triggered
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
        animationObserver.observe(element);
    });

    // Intersection Observer for project cards
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Unobserve after animation is triggered
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe project cards
    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

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
    
    // Project card hover effects with improved performance
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            requestAnimationFrame(() => {
                card.classList.add('hover');
            });
        });
        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.classList.remove('hover');
            });
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

    // Handle lazy loading with blur-up effect
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }

    // Theme toggle animation
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    // Form input animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) rotate(10deg)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Form validation and error handling
    const validateForm = (form) => {
        let isValid = true;
        const formData = new FormData(form);
        
        // Reset previous errors
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) errorMessage.remove();
        });
        
        // Validate each field
        for (let [name, value] of formData.entries()) {
            const input = form.querySelector(`[name="${name}"]`);
            const group = input.closest('.form-group');
            
            // Skip empty optional fields
            if (!input.hasAttribute('required') && !value.trim()) continue;
            
            // Validate required fields
            if (input.hasAttribute('required') && !value.trim()) {
                showError(group, 'This field is required');
                isValid = false;
                continue;
            }
            
            // Email validation
            if (input.type === 'email' && value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(group, 'Please enter a valid email address');
                    isValid = false;
                    continue;
                }
            }
            
            // Message length validation
            if (name === 'message' && value.trim().length < 10) {
                showError(group, 'Message must be at least 10 characters long');
                isValid = false;
                continue;
            }
            
            // Show success state for valid fields
            showSuccess(group);
        }
        
        return isValid;
    };

    const showError = (group, message) => {
        group.classList.add('error');
        group.classList.remove('success');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        group.appendChild(errorDiv);
    };

    const showSuccess = (group) => {
        group.classList.add('success');
        group.classList.remove('error');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message sent successfully!';
            form.insertBefore(successMessage, submitBtn);
            
            // Reset form
            form.reset();
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
            
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Failed to send message. Please try again.';
            form.insertBefore(errorMessage, submitBtn);
            
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    };

    // Add form submit handler
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

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
        window.removeEventListener('scroll', updateScrollProgress);
        animationObserver.disconnect();
        projectObserver.disconnect();
    };
});