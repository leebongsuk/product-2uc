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

// Animal Face Test Logic
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/TAX5ELtMY/";
let model, labelContainer, maxPredictions;

const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');

async function loadModel() {
    if (!model) {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

uploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading state
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Analyzing...";

    // Preview Image
    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = "block";
        
        await loadModel();
        await predict();
        
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Another Photo";
    };
    reader.readAsDataURL(file);
});

async function predict() {
    const prediction = await model.predict(imagePreview);
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    
    for (let i = 0; i < maxPredictions; i++) {
        const classLabel = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0) + "%";
        
        const barWrapper = document.createElement("div");
        barWrapper.className = "prediction-bar";
        barWrapper.innerHTML = `
            <div class="label-name">${classLabel}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${probability}"></div>
            </div>
        `;
        labelContainer.appendChild(barWrapper);
    }
}
