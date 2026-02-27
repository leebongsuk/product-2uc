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
let model, webcam, labelContainer, maxPredictions;

async function initAnimalFaceTest() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    const startBtn = document.getElementById('start-test-btn');
    startBtn.disabled = true;
    startBtn.textContent = "Loading Model...";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            const barWrapper = document.createElement("div");
            barWrapper.className = "prediction-bar";
            barWrapper.innerHTML = `
                <div class="label-name"></div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: 0%"></div>
                </div>
            `;
            labelContainer.appendChild(barWrapper);
        }
        
        startBtn.style.display = "none";
    } catch (error) {
        console.error("Webcam or Model error:", error);
        startBtn.textContent = "Error! Try Again";
        startBtn.disabled = false;
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classLabel = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0) + "%";
        
        const barRow = labelContainer.childNodes[i];
        barRow.querySelector('.label-name').textContent = classLabel;
        barRow.querySelector('.bar-fill').style.width = probability;
    }
}

document.getElementById('start-test-btn').addEventListener('click', initAnimalFaceTest);
