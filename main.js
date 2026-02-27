const generatorBtn = document.getElementById('generator-btn');
const numberSpans = document.querySelectorAll('.number');
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Lotto Generation
generatorBtn.addEventListener('click', () => {
    const lottoNumbers = [];
    while (lottoNumbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        if (!lottoNumbers.includes(randomNumber)) {
            lottoNumbers.push(randomNumber);
        }
    }

    numberSpans.forEach((span, index) => {
        span.textContent = lottoNumbers[index];
    });
});

// Theme Toggle
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
