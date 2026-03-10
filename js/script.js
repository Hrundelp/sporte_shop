function updateCountdown() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    let h = parseInt(hours.textContent);
    let m = parseInt(minutes.textContent);
    let s = parseInt(seconds.textContent);

    s--;

    if (s < 0) {
        s = 59;
        m--;
    }

    if (m < 0) {
        m = 59;
        h--;
    }

    if (h < 0) {
        h = 23;
    }

    hours.textContent = String(h).padStart(2, '0');
    minutes.textContent = String(m).padStart(2, '0');
    seconds.textContent = String(s).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// Products Scroll
function scrollProducts(direction) {
    const container = document.getElementById('flashProducts');
    const scrollAmount = 300;

    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Categories Scroll
function scrollCategories(direction) {
    const container = document.getElementById('categoriesGrid');
    const scrollAmount = 300;

    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Hero Banner Dots
const slider = document.getElementById('heroSlider');
const dots = document.querySelectorAll('.banner-dots span');
let currentSlide = 0;
let slideInterval;

function updateSlider(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');


    slider.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateSlider(index);
        restartAutoPlay(); // Сброс таймера при ручном переключении
    });
});

function startAutoPlay() {
    slideInterval = setInterval(() => {
        let next = (currentSlide + 1) % dots.length;
        updateSlider(next);
    }, 5000);
}

function restartAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

startAutoPlay();
// Smooth Scroll for Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add to Cart functionality (placeholder)
function addToCart(productName) {
    alert(`${productName} добавлен в корзину!`);
}

// Wishlist functionality (placeholder)
function addToWishlist(productName) {
    alert(`${productName} добавлен в избранное!`);
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) {
    const button = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (email && email.includes('@')) {
            alert(`Спасибо за подписку! Мы отправили письмо на ${email}`);
            input.value = '';
        } else {
            alert('Пожалуйста, введите корректный e-mail');
        }
    });
}

// Category Card Active State
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        categoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Product Image Hover Effect
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    const heartBtn = card.querySelector('.action-btn');
    if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = card.querySelector('h3').textContent;
            addToWishlist(productName);
        });
    }
});

// Mobile Menu Toggle (for responsive design)
function createMobileMenu() {
    const navbar = document.querySelector('.navbar .container');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    `;

    if (window.innerWidth <= 768) {
        const logo = navbar.querySelector('.logo');
        logo.after(menuBtn);

        menuBtn.addEventListener('click', () => {
            const menu = navbar.querySelector('.nav-menu');
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Initialize mobile menu on load
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Scroll to top button
function createScrollTopBtn() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    `;
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #DB4444;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s;
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
    });
}

createScrollTopBtn();

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

