const fs = require('fs');

const PROMPTS_FILE = 'data/prompts.json';
const IMAGE_PROMPTS_FILE = 'data/image-prompts.json';

// --- Helper: Indonesian Details ---
function getIndonesianDetail(category) {
    return `### 💎 Blueprint Prompt: ${category}\n\nPrompt ini adalah arsitektur tingkat lanjut yang dioptimalkan untuk Claude 3.5 Sonnet, GPT-4o, dan Gemini Pro. Menggunakan teknik **Chain-of-Density** dan **Persona-Layering** untuk hasil yang profesional dan konversi tinggi. Ganti variabel dalam [bracket] dengan konteks bisnis Anda.`;
}

function getImageDetail(category) {
    return `### 🎨 Blueprint Prompt: ${category}\n\nKonfigurasi Teknis — Model: Midjourney v6.1 / Flux.1 Dev | Arsitektur: High-Fidelity Photorealism | Lighting: Volumetric Cinematic | Negative: low quality, blurry, deformed.`;
}

// --- 1. Update prompts.json ---
console.log('Processing prompts.json...');
const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
const categories = [...new Set(prompts.map(p => p.category))];

const updatedPrompts = prompts.map(p => {
    const isHero = categories.includes(p.category) && prompts.find(x => x.category === p.category) === p;
    
    if (isHero) {
        // Remove from list so next one isn't Hero
        const idx = categories.indexOf(p.category);
        if (idx > -1) categories.splice(idx, 1);
        
        return {
            ...p,
            isPremium: false,
            detail: getIndonesianDetail(p.category)
        };
    } else {
        return {
            ...p,
            isPremium: true,
            detail: getIndonesianDetail(p.category)
        };
    }
});

fs.writeFileSync(PROMPTS_FILE, JSON.stringify(updatedPrompts, null, 2));
console.log('Finished prompts.json');

// --- 2. Update image-prompts.json ---
console.log('Processing image-prompts.json...');
const images = JSON.parse(fs.readFileSync(IMAGE_PROMPTS_FILE, 'utf8'));

const imageCategories = [
    "Photorealistic Portraits & Fashion",
    "Interior & Architectural Designs",
    "Logo & Branding Assets",
    "Cyberpunk & Futuristic Concepts",
    "Stock Photography & Lifestyle"
];

const foundHero = new Set();

const updatedImages = images.map(p => {
    let newCat = "Stock Photography & Lifestyle";
    const tags = (p.tags || []).map(t => t.toLowerCase());
    
    if (tags.includes('portrait') || tags.includes('fashion')) newCat = "Photorealistic Portraits & Fashion";
    else if (tags.includes('architecture') || tags.includes('interior')) newCat = "Interior & Architectural Designs";
    else if (tags.includes('logo') || tags.includes('branding')) newCat = "Logo & Branding Assets";
    else if (tags.includes('cyberpunk') || tags.includes('futuristic')) newCat = "Cyberpunk & Futuristic Concepts";

    let isHero = false;
    if (!foundHero.has(newCat)) {
        isHero = true;
        foundHero.add(newCat);
    }

    return {
        ...p,
        category: newCat,
        isPremium: !isHero,
        detail: getImageDetail(newCat)
    };
});

fs.writeFileSync(IMAGE_PROMPTS_FILE, JSON.stringify(updatedImages, null, 2));
console.log('Finished image-prompts.json');
