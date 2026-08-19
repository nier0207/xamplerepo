// Light mode toggle functionality
const lightModeToggle = () => {
    const body = document.body;
    const sunIcon = document.getElementById('sun');
    const moonIcon = document.getElementById('moon');

    // Check for saved mode preference or default to dark mode
    const currentMode = localStorage.getItem('mode') || 'dark';

    // Apply saved mode on page load
    if (currentMode === 'light') {
        body.classList.add('light-mode');
    }

    // Toggle event listener
    const toggleMode = () => {
        body.classList.toggle('light-mode');
        const newMode = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('mode', newMode);
    };

    sunIcon.addEventListener('click', toggleMode);
    moonIcon.addEventListener('click', toggleMode);
};

// Initialize light mode toggle on page load
document.addEventListener('DOMContentLoaded', lightModeToggle);

const aboutImg = document.querySelector('.about-img');

if (aboutImg) {
  const image = aboutImg.querySelector('img');

  const handleMove = (event) => {
    const rect = aboutImg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    const rotateY = px * 12;
    const rotateX = -py * 12;
    const translateX = px * 10;
    const translateY = py * 10;

    image.style.setProperty('--rx', `${rotateX}deg`);
    image.style.setProperty('--ry', `${rotateY}deg`);
    image.style.setProperty('--tx', `${translateX}px`);
    image.style.setProperty('--ty', `${translateY}px`);
  };

  const resetMove = () => {
    image.style.setProperty('--rx', '0deg');
    image.style.setProperty('--ry', '0deg');
    image.style.setProperty('--tx', '0px');
    image.style.setProperty('--ty', '0px');
    image.style.setProperty('--s', '1');
  };

  aboutImg.addEventListener('mousemove', handleMove);
  aboutImg.addEventListener('mouseleave', resetMove);
  image.addEventListener('mouseleave', resetMove);
  aboutImg.addEventListener('mouseenter', resetMove);
}
/* ============================= */
/* NEW: Interactive features     */
/* ============================= */

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('bx-menu');
        icon.classList.toggle('bx-x');
    });

    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('bx-menu');
            icon.classList.remove('bx-x');
        });
    });
}

// Active nav link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
}

// Scroll reveal animations
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
}

// Typing / rotating role text
const typedRole = document.getElementById('typedRole');
if (typedRole) {
    const roles = ['web developer', 'frontend coder', 'UI/UX enthusiast', 'problem solver'];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    const typeLoop = () => {
        const currentRole = roles[roleIndex];

        if (!deleting) {
            charIndex++;
            if (charIndex > currentRole.length) {
                deleting = true;
                setTimeout(typeLoop, 1400);
                return;
            }
        } else {
            charIndex--;
            if (charIndex < 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                charIndex = 0;
            }
        }

        typedRole.textContent = currentRole.substring(0, charIndex);
        setTimeout(typeLoop, deleting ? 45 : 90);
    };

    setTimeout(typeLoop, 1400);
}

// Animated stat counters
const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(step);
    };

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => statObserver.observe(el));
}

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const filterEmpty = document.getElementById('filterEmpty');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            let visibleCount = 0;

            projectCards.forEach(card => {
                const matches = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('hidden', !matches);
                if (matches) visibleCount++;
            });

            if (filterEmpty) {
                filterEmpty.classList.toggle('show', visibleCount === 0);
            }
        });
    });
}

// Toast helper
const toast = document.getElementById('toast');
let toastTimer = null;
const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
};

// Contact form validation (client-side only, no backend configured)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (input, errorEl, message) => {
        input.classList.toggle('invalid', Boolean(message));
        if (errorEl) errorEl.textContent = message || '';
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        if (!nameInput.value.trim()) {
            setError(nameInput, nameError, 'Please enter your name.');
            valid = false;
        } else {
            setError(nameInput, nameError, '');
        }

        if (!emailPattern.test(emailInput.value.trim())) {
            setError(emailInput, emailError, 'Please enter a valid email.');
            valid = false;
        } else {
            setError(emailInput, emailError, '');
        }

        if (!messageInput.value.trim()) {
            setError(messageInput, messageError, 'Please write a message.');
            valid = false;
        } else {
            setError(messageInput, messageError, '');
        }

        if (!valid) return;

        // No backend is wired up yet — this simulates a successful send.
        // To make it functional, connect this form to a service like Formspree,
        // EmailJS, or your own backend endpoint.
        showToast(`Thanks, ${nameInput.value.trim()}! Your message is ready to send.`);
        contactForm.reset();
    });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Auto-update footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
