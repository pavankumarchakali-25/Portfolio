// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    const sections = ['about', 'experience', 'projects', 'resume', 'contact'];
    let activeSection = 'about'; // Default active section

    // --- Element Selectors ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavButtons = document.querySelectorAll('.nav-btn-mobile');
    const desktopNavButtons = document.querySelectorAll('.nav-btn');
    const typedTextElement = document.getElementById('typed-text');
    const canvas = document.getElementById('hero-particles');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    
    let isMenuOpen = false;
    let mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('svg') : null;

    // --- Core Functions ---

    /**
     * Toggles the mobile navigation menu.
     */
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
        
        // Toggle hamburger/close icon
        if (mobileMenuIcon) {
            if (isMenuOpen) {
                mobileMenuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                mobileMenuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
            }
        }
    }

    /**
     * Scrolls smoothly to a given section by its ID.
     * @param {string} id - The ID of the section to scroll to.
     */
    function scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80, // Offset for sticky header
                behavior: 'smooth'
            });
        }
        // Close mobile menu on link click
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }

    /**
     * Updates the active navigation link based on scroll position.
     */
    function handleScroll() {
        const pageYOffset = window.pageYOffset;
        let newActiveSection = null;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (pageYOffset >= sectionTop - 150 && pageYOffset < sectionTop + sectionHeight - 150) {
                    newActiveSection = sectionId;
                }
            }
        });

        if (newActiveSection && newActiveSection !== activeSection) {
            activeSection = newActiveSection;
            // Update desktop nav button styles
            desktopNavButtons.forEach(btn => {
                if (btn.dataset.section === activeSection) {
                    btn.classList.add('text-blue-400', 'font-semibold');
                } else {
                    btn.classList.remove('text-blue-400', 'font-semibold');
                }
            });
        }
    }

    // --- Event Listener Assignments ---

    // Navigation Scrolling
    desktopNavButtons.forEach(btn => {
        btn.addEventListener('click', () => scrollToSection(btn.dataset.section));
    });

    mobileNavButtons.forEach(btn => {
        btn.addEventListener('click', () => scrollToSection(btn.dataset.section));
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    } else {
        console.warn("Mobile menu button '#mobile-menu-btn' not found.");
    }

    // Active Nav Highlighting on Scroll
    window.addEventListener('scroll', handleScroll);


    // --- Hero Section: Typing Effect ---
    if (typedTextElement) {
        const phrases = [
            "A passionate web developer.",
            "A problem-solver and quick learner.",
            "An aspiring software engineer.",
            "A collaborative team player.",
            "A detail-oriented content creator."
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeTimeout;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            const displayChar = isDeleting
                ? currentPhrase.substring(0, charIndex--)
                : currentPhrase.substring(0, charIndex++);

            typedTextElement.textContent = displayChar;

            let typingSpeed = 100;
            if (isDeleting) typingSpeed /= 2;

            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            typeTimeout = setTimeout(type, typingSpeed);
        };
        type(); // Start the typing effect
    }

    // --- Hero Section: Particle Animation ---
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;
        let animationFrameId;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = 'rgba(99, 179, 237, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        resizeCanvas();
        animateParticles();
        window.addEventListener('resize', resizeCanvas);
    }

    // --- Projects Section: 3D Tilt Effect ---
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tiltX = (y - rect.height / 2) / 20; // Tilt more or less by changing 20
            const tiltY = (x - rect.width / 2) / -20;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });

    // --- Contact Section: Form Submission ---
    if (contactForm) {
        const submitBtn = document.getElementById('contact-submit-btn');
        const statusSuccess = document.getElementById('contact-status-success');
        const statusError = document.getElementById('contact-status-error');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            if(submitBtn) submitBtn.disabled = true;
            if(submitBtn) submitBtn.innerHTML = '<div class="spinner mx-auto"></div>';
            if(statusSuccess) statusSuccess.classList.add('hidden');
            if(statusError) statusError.classList.add('hidden');

            const form = e.target;
            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if(statusSuccess) statusSuccess.classList.remove('hidden');
                    form.reset();
                } else {
                    if(statusError) statusError.classList.remove('hidden');
                }
            } catch (error) {
                if(statusError) statusError.classList.remove('hidden');
            } finally {
                // Reset button
                if(submitBtn) submitBtn.disabled = false;
                if(submitBtn) submitBtn.innerHTML = 'Send Message';
                // Hide status messages after 3 seconds
                setTimeout(() => {
                    if(statusSuccess) statusSuccess.classList.add('hidden');
                    if(statusError) statusError.classList.add('hidden');
                }, 3000);
            }
        });
    }

    // --- Contact Section: Copy Email ---
    if (copyEmailBtn) {
        const emailAddress = 'c.pavan9949@gmail.com';
        
        copyEmailBtn.addEventListener('click', () => {
            const textArea = document.createElement('textarea');
            textArea.value = emailAddress;
            // Make it non-visible
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            
            textArea.select();
            try {
                document.execCommand('copy');
                copyEmailBtn.textContent = 'Copied!';
            } catch (err) {
                copyEmailBtn.textContent = 'Error';
            }
            document.body.removeChild(textArea);

            // Reset button text after 2 seconds
            setTimeout(() => {
                copyEmailBtn.textContent = 'Copy';
            }, 2000);
        });
    }

});

