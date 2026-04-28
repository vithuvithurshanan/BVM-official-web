/**
 * bvm.Dev - Interactive Logic
 * Handles animations, navigation effects, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Removal ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.style.overflow = 'visible';
            document.body.style.pointerEvents = 'auto';
        };

        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 2500); 
        });

        // Fallback: Force hide after 6 seconds if load event doesn't fire
        setTimeout(hidePreloader, 6000);
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

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
            document.body.style.overflow = navLinksList.classList.contains('active') ? 'hidden' : 'visible';
        });
    }

    // --- Smooth Scroll for Navigation ---
    const navLinks = document.querySelectorAll('.nav-links a, .nav-cta a, .hero-btns a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Close mobile menu on link click
            if (navLinksList.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
                document.body.style.overflow = 'visible';
            }

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

    // --- Contact Form Handling (Formspree) ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            const firstName = document.getElementById('first-name').value.trim();
            const lastName  = document.getElementById('last-name').value.trim();
            const email     = document.getElementById('email').value.trim();
            const message   = document.getElementById('message').value.trim();

            const formData = {
                "First Name": firstName,
                "Last Name":  lastName,
                "Email Address": email,
                "Message":    message,
                _replyto:   email,
                _subject:   `New Enquiry from ${firstName} ${lastName}`,
            };

            try {
                const response = await fetch('https://formspree.io/f/xkokklpw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    // Success Notification
                    const toast = document.getElementById('toast');
                    toast.classList.add('active');
                    
                    submitBtn.innerHTML = '✅ Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981';
                    contactForm.reset();

                    // Hide toast after 5 seconds
                    setTimeout(() => {
                        toast.classList.remove('active');
                    }, 5000);

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Server error');
                }
            } catch (error) {
                console.error('Formspree error:', error);
                submitBtn.innerHTML = '❌ Failed. Try Again.';
                submitBtn.style.backgroundColor = '#ef4444';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
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

    // --- Toast Close ---
    const toastClose = document.getElementById('toastClose');
    const toast = document.getElementById('toast');
    if (toastClose && toast) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('active');
        });
    }

    // --- Accessibility: Force Lucide Icons on dynamic elements if any ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
