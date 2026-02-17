document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Site Loaded');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Typing Effect
    const textElement = document.querySelector('.typing-text');
    const phrases = ['Graphic Designer', 'Typography Specialist'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 50;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 30; // Faster deletion
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80; // Faster typing
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1500; // Shorter pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 300; // Shorter pause before new phrase
        }

        setTimeout(type, typeSpeed);
    }

    if (textElement) {
        type();
    }

    // Simple Intersection Observer setup for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // ... fade-in observer ...

    // --- 3D Particle System ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration
    // Configuration
    const particleCount = 40; // Geometric shapes are fewer but nicer
    const connectionDistance = 150;
    const baseSpeed = 0.5;

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.5; // Depth factor
            this.size = Math.random() * 10 + 5; // Larger for shapes
            this.vx = (Math.random() - 0.5) * baseSpeed;
            this.vy = (Math.random() - 0.5) * baseSpeed;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.type = Math.floor(Math.random() * 4); // 0: Circle, 1: Square, 2: Triangle, 3: Cross

            // Varied opacity colors (White)
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`;
        }

        update() {
            // Standard Movement
            this.x += this.vx * this.z;
            this.y += this.vy * this.z;
            this.rotation += this.rotationSpeed;

            // Scroll Reaction
            const scrollFactor = scrollY * 0.05;

            // Mouse Interaction
            const mouseFactorX = (mouseX - width / 2) * 0.005 * this.z;
            const mouseFactorY = (mouseY - height / 2) * 0.005 * this.z;

            // Boundary Wrap
            if (this.x > width + 50) this.x = -50;
            if (this.x < -50) this.x = width + 50;
            if (this.y > height + 50) this.y = -50;
            if (this.y < -50) this.y = height + 50;

            // Draw Position
            this.drawX = this.x + mouseFactorX;
            this.drawY = this.y + mouseFactorY - scrollFactor;

            // Wrap Y based on scroll
            if (this.drawY < -100) this.y += height + 100 + scrollFactor;
            if (this.drawY > height + 100) this.y -= height + 100;
        }

        draw() {
            ctx.save();
            ctx.translate(this.drawX, this.drawY);
            ctx.rotate(this.rotation * Math.PI / 180);

            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;

            // Scale based on depth (z)
            const scale = this.z * 0.5;
            ctx.scale(scale, scale);

            ctx.beginPath();

            // Draw diverse shapes
            switch (this.type) {
                case 0: // Circle (Hollow)
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 1: // Square (Filled or Hollow)
                    if (Math.random() > 0.5) ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    else ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    break;
                case 2: // Triangle
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size, this.size);
                    ctx.lineTo(-this.size, this.size);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case 3: // Cross
                    ctx.moveTo(-this.size, 0);
                    ctx.lineTo(this.size, 0);
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(0, this.size);
                    ctx.stroke();
                    break;
            }

            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        // Spin the whole system slowly
        // Note: Actual 3D rotation matrix would be better, but simple 2D orbit is cheaper/cleaner here

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    initParticles();
    animateParticles();

    // --- Dynamic Lighting Observer ---
    const themeObserverOptions = {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: "-10% 0px -10% 0px"
    };

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.classList.remove('theme-dark', 'theme-light');

                if (entry.target.id === 'about' || entry.target.id === 'universe') {
                    document.body.classList.add('theme-dark');
                } else if (entry.target.id === 'hire') {
                    document.body.classList.add('theme-light');
                } else if (entry.target.id === 'home') {
                    // Explicitly clear themes when returning to hero
                    // This creates a smooth transition back to the default vivid state
                    document.body.classList.remove('theme-dark', 'theme-light');
                }
            }
        });
    }, themeObserverOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        themeObserver.observe(section);
    });

    // --- Header Scroll Transformation ---
    const header = document.querySelector('.header');
    const navBar = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (navBar) navBar.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            if (navBar) navBar.classList.remove('scrolled');
        }
    });

    // --- Page Loader ---
    // --- Page Loader ---
    const finishLoader = () => {
        // Allow a minimum time for the animation to play (e.g., 2.5s)
        setTimeout(() => {
            document.body.classList.add('loaded');
            document.body.style.overflow = ''; // Re-enable scroll

            // Trigger Content Reveal
            const revealElements = document.querySelectorAll('.reveal-text');
            revealElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, 600 + (index * 200)); // Start after loader wipe (approx 600ms buffer)
            });

        }, 2500);
    };

    if (document.readyState === 'complete') {
        finishLoader();
    } else {
        window.addEventListener('load', finishLoader);
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Ring follows with CSS transition (lag effect)
            cursorRing.style.left = `${posX}px`;
            cursorRing.style.top = `${posY}px`;
        });

        // Hover Effect for Links & Buttons
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-pill');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('cursor-hover');
            });
        });
    }

    // --- Contact Pills Spotlight ---
    const contactPills = document.querySelectorAll('.contact-pill');
    contactPills.forEach(pill => {
        pill.addEventListener('mousemove', (e) => {
            const rect = pill.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            pill.style.setProperty('--mouse-x', `${x}px`);
            pill.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Mobile Menu Toggle ---
    // (Removed)

    // --- Footer Scroll Interaction (Color Shift) ---
    const footer = document.getElementById('main-footer');

    if (footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.add('footer-visible');
                } else {
                    document.body.classList.remove('footer-visible');
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of footer is visible
        });

        observer.observe(footer);

        // Spotlight Effect Mouse Tracking
        footer.addEventListener('mousemove', (e) => {
            const rect = footer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            footer.style.setProperty('--mouse-x', `${x}px`);
            footer.style.setProperty('--mouse-y', `${y}px`);
        });
    }



    // --- Side Projects Popup ---
    const sideProjectsCard = document.getElementById('side-projects-card');
    const popup = document.getElementById('dev-popup');
    const closeBtn = document.getElementById('close-popup');

    if (sideProjectsCard && popup && closeBtn) {
        sideProjectsCard.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if any (though it's a div now)
            popup.classList.remove('hidden');
        });

        closeBtn.addEventListener('click', () => {
            popup.classList.add('hidden');
        });

        // Close when clicking outside content
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.add('hidden');
            }
        });
    }
});
