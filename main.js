/**
 * bvm.Dev - Interactive Logic
 * Handles animations, navigation effects, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Removal ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Letters finish at ~1.6s (last letter 0.8s delay + 0.8s duration), hide after a brief pause
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 2000);
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // --- Automatic Staggering for Grid Items ---
                const parentGrid = target.closest('.services-grid, .projects-grid, .check-list');
                if (parentGrid) {
                    const children = Array.from(parentGrid.querySelectorAll('.reveal, li'));
                    const index = children.indexOf(target);
                    if (index !== -1) {
                        target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }
                
                target.classList.add('active');
            } else {
                // Optional: Remove active class when element leaves viewport 
                // to allow animation to replay on next scroll
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Header Background ---
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY < 100) {
            // Initial State: Transparent & Absolute
            header.classList.remove('sticky-active', 'sticky-hide');
        } else if (scrollY >= 100 && scrollY < 400) {
            // Transition State: Hide the navbar
            header.classList.remove('sticky-active');
            header.classList.add('sticky-hide');
        } else {
            // Sticky State: Slide down as black pod
            header.classList.remove('sticky-hide');
            header.classList.add('sticky-active');
        }

        // --- Active Navigation Link on Scroll ---
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
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

    // --- Get Service Auto-fill ---
    const getServiceBtns = document.querySelectorAll('.get-service-btn');
    const subjectField = document.getElementById('subject');

    getServiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service');
            if (subjectField) {
                subjectField.value = `Inquiry regarding ${serviceName}`;
                // Optional: Focus the field to show it worked
                subjectField.style.boxShadow = '0 0 0 2px var(--primary)';
                setTimeout(() => subjectField.style.boxShadow = '', 2000);
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
            const subject   = document.getElementById('subject').value.trim();
            const message   = document.getElementById('message').value.trim();

            const formData = {
                "First Name": firstName,
                "Last Name":  lastName,
                "Email Address": email,
                "Subject": subject,
                "Message":    message,
                _replyto:   email,
                _subject:   `New Enquiry: ${subject} from ${firstName} ${lastName}`,
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
            item.classList.toggle('faq-active');
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

    // --- 3D Particle Swarm Animation (Dala Style) ---
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = document.querySelector('.hero').offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        });

        const particles = [];
        const numParticles = 2500;
        // Premium Dala color palette
        const colors = ['#8b5cf6', '#c084fc', '#fcd34d', '#38bdf8', '#ffffff'];
        
        // Ellipsoid radii to spread across the full hero section
        const rx = width * 0.55;
        const ry = height * 0.55;
        const rz = Math.min(width, height) * 0.5;
        
        // Initialize particles in a 3D spherical/ellipsoid volume
        for (let i = 0; i < numParticles; i++) {
            // Random point using spherical coordinates
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            // Allow volume by randomizing the radius multiplier
            const r_factor = 0.2 + Math.random() * 0.8;
            
            const x = rx * r_factor * Math.sin(phi) * Math.cos(theta);
            const y = ry * r_factor * Math.sin(phi) * Math.sin(theta);
            const z = rz * r_factor * Math.cos(phi);
            
            particles.push({
                baseX: x,
                baseY: y,
                baseZ: z,
                x: x,
                y: y,
                z: z,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 1.5 + 0.5,
                isTriangle: Math.random() > 0.3 // Mostly triangles
            });
        }

        let mouse = { x: width / 2, y: height / 2, active: false };
        const heroSection = document.querySelector('.hero');
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        // 3D rotation angles
        let angleX = 0;
        let angleY = 0;

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            // Slow continuous rotation
            angleY += 0.003;
            angleX += 0.0015;

            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);
            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);

            const fov = 400;
            const viewerDistance = 500;

            particles.forEach(p => {
                // 1. Rotate base positions
                let rotX = p.baseX * cosY - p.baseZ * sinY;
                let rotZ = p.baseZ * cosY + p.baseX * sinY;
                let rotY = p.baseY * cosX - rotZ * sinX;
                rotZ = rotZ * cosX + p.baseY * sinX;

                // 2. Mouse interaction (Repel)
                let forceX = 0;
                let forceY = 0;
                
                // Project base rotated position to 2D to check mouse distance
                let baseScale = fov / (fov + rotZ + viewerDistance);
                let baseProjX = rotX * baseScale + width / 2;
                let baseProjY = rotY * baseScale + height / 2;

                if (mouse.active) {
                    const dx = mouse.x - baseProjX;
                    const dy = mouse.y - baseProjY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 250) {
                        const force = (250 - dist) / 250;
                        // Push outward violently
                        forceX = -(dx / dist) * force * 300;
                        forceY = -(dy / dist) * force * 300;
                    }
                }

                // 3. Spring physics: pull back to rotated base position
                p.x += (rotX + forceX - p.x) * 0.1;
                p.y += (rotY + forceY - p.y) * 0.1;
                p.z += (rotZ - p.z) * 0.1;

                // 4. Final 3D Projection
                const scale = fov / (fov + p.z + viewerDistance);
                const px = p.x * scale + width / 2;
                const py = p.y * scale + height / 2;

                // 5. Draw
                if (p.z > -viewerDistance) {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.min(1, Math.max(0.1, scale * 1.5));
                    
                    ctx.beginPath();
                    if (p.isTriangle) {
                        const s = p.size * scale * 2.5;
                        ctx.moveTo(px, py - s);
                        ctx.lineTo(px + s, py + s);
                        ctx.lineTo(px - s, py + s);
                    } else {
                        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
                    }
                    ctx.fill();
                }
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // --- Accessibility: Force Lucide Icons on dynamic elements if any ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
