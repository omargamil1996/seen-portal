let appData = {};

async function loadData() {
    try {
        const response = await fetch('assets/data.json');
        appData = await response.json();
        initPage();
    } catch (error) {
        console.error("Error loading data.json:", error);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = scrolled + "%";
};

function animateCounters() {
    const counters = document.querySelectorAll('.kpi-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.innerText = target;
                        clearInterval(timer);
                    } else {
                        entry.target.innerText = current.toFixed(1);
                    }
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => observer.observe(el));
}

function calculateFinancials() {
    const price = parseFloat(document.getElementById('f-price')?.value || appData.financials.default_price);
    const churn = parseFloat(document.getElementById('f-churn')?.value || appData.financials.default_churn) / 100;
    const cac = parseFloat(document.getElementById('f-cac')?.value || appData.financials.default_cac);
    const newCust = parseFloat(document.getElementById('f-new')?.value || appData.financials.default_new);
    const margin = parseFloat(document.getElementById('f-margin')?.value || appData.financials.default_margin) / 100;
    const fixed = parseFloat(document.getElementById('f-fixed')?.value || appData.financials.default_fixed);

    const setLabel = (id, val, suffix = '') => {
        const el = document.getElementById(id);
        if (el) el.innerText = val + suffix;
    };
    setLabel('v-price', price, ' SAR');
    setLabel('v-churn', (churn * 100), '%');
    setLabel('v-cac', cac, ' SAR');
    setLabel('v-new', newCust);
    setLabel('v-margin', (margin * 100), '%');
    setLabel('v-fixed', fixed, ' SAR');

    const ltv = (price * margin) / churn;
    const ltvCac = ltv / cac;
    const payback = cac / (price * margin);
    
    let customers = 0;
    let mrr12 = 0, mrr36 = 0, breakeven = 0, cumulativeProfit = -cac;

    for (let m = 1; m <= 36; m++) {
        customers = (customers * (1 - churn)) + newCust;
        const mrr = customers * price;
        if (m === 12) mrr12 = mrr;
        if (m === 36) mrr36 = mrr;
        
        const monthlyProfit = (mrr * margin) - fixed - (newCust * cac);
        cumulativeProfit += monthlyProfit;
        if (breakeven === 0 && cumulativeProfit >= 0) breakeven = m;
    }

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setVal('out-ltv', Math.round(ltv).toLocaleString() + ' SAR');
    setVal('out-ltv-cac', ltvCac.toFixed(1) + 'x');
    setVal('out-payback', payback.toFixed(1) + ' شهر');
    setVal('out-mrr12', Math.round(mrr12).toLocaleString() + ' SAR');
    setVal('out-mrr36', Math.round(mrr36).toLocaleString() + ' SAR');
    setVal('out-breakeven', breakeven > 0 ? 'شهر ' + breakeven : '> 36');
}

let currentSlide = 0;
function initDeck() {
    const container = document.getElementById('slides');
    const dots = document.getElementById('deck-dots');
    if (!container || !appData.pitch_slides) return;

    appData.pitch_slides.forEach((text, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide ' + (index === 0 ? 'active' : '');
        slide.innerHTML = '<h3>' + text + '</h3>';
        container.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = 'dot ' + (index === 0 ? 'active' : '');
        dot.onclick = () => goToSlide(index);
        dots.appendChild(dot);
    });
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}
function nextSlide() { goToSlide((currentSlide + 1) % appData.pitch_slides.length); }
function prevSlide() { goToSlide((currentSlide - 1 + appData.pitch_slides.length) % appData.pitch_slides.length); }

function initPage() {
    animateCounters();
    initDeck();
    
    ['f-price', 'f-churn', 'f-cac', 'f-new', 'f-margin', 'f-fixed'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = appData.financials[id.replace('f-', 'default_')];
            el.addEventListener('input', calculateFinancials);
        }
    });
    calculateFinancials();

    const urlParams = new URLSearchParams(window.location.search);
    const investor = urlParams.get('investor');
    if (investor) {
        const wm = document.getElementById('watermark');
        if (wm) wm.innerText = 'سري - ' + decodeURIComponent(investor);
    }
}

document.addEventListener('DOMContentLoaded', loadData);
