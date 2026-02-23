// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function closeMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function toggleMenu() {
    hamburger?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open', navMenu?.classList.contains('active'));
}

hamburger?.addEventListener('click', toggleMenu);

// Smooth scrolling for navigation links + close menu on click
document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') && !navMenu.contains(e.target) && !hamburger?.contains(e.target)) {
        closeMenu();
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.about-content, .video-item, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Smooth word-by-word reveal for "O meni" section
const revealTexts = [
    "Bavim se video editingom sa strastvenim pristupom kreiranju vizuelnih priča koje privlače pažnju i ostavljaju trajan utisak. Kroz kreativnu upotrebu najsavremenijih alata i tehnika, transformiram sirove snimke u profesionalne video projekte.",
    "Specijalizovan sam za rad sa Adobe Premiere Pro i Adobe After Effects, kombinujući tehniku sa kreativnošću kako bih dostigao najbolje rezultate za svaki projekat."
];

const secondParagraphHTML = "Specijalizovan sam za rad sa <strong>Adobe Premiere Pro</strong> i <strong>Adobe After Effects</strong>, kombinujući tehniku sa kreativnošću kako bih dostigao najbolje rezultate za svaki projekat.";

let revealStarted = false;

function parseWordsWithHTML(html) {
    const parts = [];
    const regex = /(<strong>.*?<\/strong>)|([^\s<]+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        if (match[1]) parts.push({ html: match[1], isHTML: true });
        else if (match[2]) parts.push({ text: match[2], isHTML: false });
    }
    return parts;
}

function revealWords(element, items, maxDuration, onComplete) {
    const delayPerWord = Math.max(25, maxDuration / items.length);
    
    items.forEach((item, i) => {
        const span = document.createElement('span');
        span.className = 'word-span';
        if (item.isHTML) {
            span.innerHTML = item.html;
        } else {
            span.textContent = item.text;
        }
        element.appendChild(span);
        if (i < items.length - 1) element.appendChild(document.createTextNode(' '));
        
        setTimeout(() => span.classList.add('visible'), i * delayPerWord);
    });
    
    if (onComplete) setTimeout(onComplete, items.length * delayPerWord + 250);
}

// Start word reveal when about section is visible
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !revealStarted) {
            revealStarted = true;
            const p1 = document.getElementById('word-reveal-1');
            const p2 = document.getElementById('word-reveal-2');
            
            if (p1 && p2) {
                const words1 = revealTexts[0].split(' ').map(t => ({ text: t, isHTML: false }));
                const words2 = parseWordsWithHTML(secondParagraphHTML);
                
                revealWords(p1, words1, 1500, () => {
                    p2.style.display = 'block';
                    revealWords(p2, words2, 1500);
                });
            }
        }
    });
}, { threshold: 0.2 });

const aboutSection = document.querySelector('.about-text');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}
