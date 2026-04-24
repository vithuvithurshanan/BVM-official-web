/**
 * bvm.Dev - Interactive Logic
 * Handles animations, navigation effects, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Removal ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const removePreloader = () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.style.overflow = 'visible';
                // Remove preloader from DOM after transition
                setTimeout(() => preloader.remove(), 1000);
            }, 1000); // Reduced delay to 1s for better UX
        };

        if (document.readyState === 'complete') {
            removePreloader();
        } else {
            window.addEventListener('load', removePreloader);
        }
    }
    
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Header Background ---
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll for Navigation ---
    const navLinks = document.querySelectorAll('.nav-links a, .nav-cta a, .hero-btns a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 80; // Offset for sticky header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetElement.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinkEls = document.querySelectorAll('.nav-links a');

    const setActiveLink = (id) => {
        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    const updateActiveNav = () => {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const scrollMid = window.scrollY + headerHeight + 10;

        let currentId = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollMid) {
                currentId = section.id;
            }
        });

        if (currentId) setActiveLink(currentId);
    };

    // Run on scroll
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    // Run once on load to set initial state
    updateActiveNav();

    // Set active immediately on nav click too
    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                setActiveLink(href.substring(1));
            }
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show a simple feedback (can be enhanced with a modal)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#10b981'; // Success green
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Accessibility: Force Lucide Icons on dynamic elements if any ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
