let net;

// Load the MobileNet model
async function loadModel() {
    try {
        net = await mobilenet.load();
        console.log("Model loaded.");
        document.getElementById('result').innerText = "Model loaded successfully. Upload an image to classify.";
    } catch (error) {
        console.error("Error loading model:", error);
        document.getElementById('result').innerText = "Failed to load the model.";
    }
}

// Call loadModel when the page loads
window.onload = loadModel;

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.getElementById('imagePreview');
            image.src = e.target.result;
            image.onload = () => classifyImage(image);
        };
        reader.readAsDataURL(file);
    }
});

async function classifyImage(image) {
    if (!net) {
        document.getElementById('result').innerText = "Model is not loaded yet. Please wait.";
        return;
    }

    try {
        const predictions = await net.classify(image);
        const result = predictions.map(pred => `${pred.className}: ${Math.round(pred.probability * 100)}%`).join('\n');
        document.getElementById('result').innerText = `Classification Result:\n${result}`;
    } catch (error) {
        console.error("Error classifying image:", error);
        document.getElementById('result').innerText = "Error classifying image.";
    }
}
