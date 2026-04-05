const fs = require('fs');

const PROMPTS_FILE = 'data/prompts.json';
const IMAGE_PROMPTS_FILE = 'data/image-prompts.json';

// --- 1. Upgrade prompts.json Heroes ---
const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));

const textUpgrades = {
    "TikTok Affiliate Viral (Hooks & Scripts)": "Act as a high-conversion viral marketer. Create a 15-second TikTok script for [product] using a 'Subliminal Hook' that triggers immediate pattern interrupts. Structure: 0-3s: The Shock (Visual + Audio), 3-10s: The Agitation (Emotional Gap), 10-15s: The One-Click CTA. Use hyper-dynamic pacing and specify text overlays for maximum retention.",
    "High-Converting Copywriting (FB/IG Ads)": "Develop an 'Empathy-First' FB/IG ad copy for [product/service]. Utilize the '4U' Headline formula (Urgent, Unique, Ultra-specific, Useful). Body copy must use the 'PAS-O' framework (Problem, Agitate, Solution, Outcome). Tone: Authoritative yet relatable. Format for mobile readability with bullet points and clear benefit-driven spacing.",
    "Personal Branding Expert (LinkedIn/IG)": "Draft a 'Thought-Leadership' LinkedIn post for [Executive Persona] about [Topic]. Start with a 'Contrarian Statement' to stop the scroll. Follow with a 3-point 'Wisdom-Audit' based on real-world data/experience. Close with an 'Engaging Inquiry' to drive high-quality comments. Style: Minimalist, high white-space, bold first line.",
    "Customer Service & Crisis Management": "Act as a PR Crisis Response Specialist. Draft a 'Recovery-Focused' response to [Customer Complain/Crisis]. Use the 'Acknowledge, Empathize, Resolve' (AER) protocol. Ensure the tone is sincere but legally sound. Provide 3 options for resolution based on the severity of [Incident].",
    "Daily Content Ideas (30-Day Calendar Niche-based)": "Generate a 'Semantic-Reach' 30-day content calendar for [Niche/Industry]. The calendar must alternate between 3 Pillars: 1. Value (Education), 2. Authority (Case Studies), and 3. Personality (Behind the scenes). Each day must include a 'Low-Friction Hook' and a specific 'Algorithm-Weight' format (e.g., Carousel vs Reel).",
    "Market Research & Competitor Analysis": "Conduct a 'Blue Ocean' competitor audit for [Industry/Niche]. Identify 3 'Unmet Psychological Needs' in [Competitor A, B, and C]'s reviews. Suggest a 'Unique Value Proposition' (UVP) that exploits these gaps. Output format: SWOT-X Analysis (SWOT + Execution Priority).",
    "YouTube / Long Video Scripting": "Write a 'Retention-Optimized' YouTube script for [Topic]. Implement the 'Open Loop' storytelling method. 0-60s: The Narrative Premise (Why this matters), 1-5min: The Knowledge Gaps (Deep-dive), 5min+: The Payoff & Subscriber Magnet. Include 'Visual B-Roll' directives and 'Transition Hooks'.",
    "Email Marketing & FOMO Newsletters": "Draft a 'Frictionless-Conversion' Sales Email for [Product Launch]. Subject line must use 'Curiosity-First' psychology (max 5 words). Body: Use the 'Story-Pivot-Pitch' structure. Closing: Implement a 'Scarcity-Anchor' (Time or Quantity) that feels authentic, not salesy.",
    "Storytelling & Emotional Selling": "Craft a 'Hero's Journey' brand story for [Brand/Founder]. Define the 'Villain' (The common problem) and the 'Magic Tool' (The product). Ensure the narrative arc triggers dopamine and oxytocin release. Narrative Tone: Vulnerable, inspiring, and transformative.",
    "Product Launch Strategy (H-7 to Launch Day)": "Construct an 'Omni-Channel' H-7 launch sequence for [Digital Product]. Day 7-5: The Tease (Mysterious), Day 4-2: The Education (Benefits), Day 1: The Pre-Launch (Exclusive Access), Day 0: The Full Drop. Include specific 'Social Proof' placement directives for each phase."
};

const finalPrompts = prompts.map(p => {
    if (!p.isPremium && textUpgrades[p.category]) {
        return {
            ...p,
            content: textUpgrades[p.category]
        };
    }
    return p;
});

fs.writeFileSync(PROMPTS_FILE, JSON.stringify(finalPrompts, null, 2));

// --- 2. Upgrade image-prompts.json Heroes ---
const images = JSON.parse(fs.readFileSync(IMAGE_PROMPTS_FILE, 'utf8'));

const imageUpgrades = {
    "Cyberpunk & Futuristic Concepts": "Ultra-sharp 8K cinematic shot of a [subject] in a sprawling cyberpunk metropolis at neon-drenched midnight. Rain-slicked streets reflecting holographic advertisements. Volumetric god rays, atmospheric fog rolling. Camera: Arri Alexa 65, 35mm lens. Lighting: Cyan and Magenta dual-tone. Style: Photorealistic Futurism v6.1.",
    "Photorealistic Portraits & Fashion": "Editorial fashion portrait of a [Model Persona] for Vogue. Wearing avant-garde [Style/Material] couture. High-contrast studio lighting (Chiaroscuro). Extreme facial detail, skin pores visible. 8K, Hasselblad H6D quality. Background: Minimalist matte grey. Fashion editorial depth-of-field.",
    "Interior & Architectural Designs": "Hyper-realistic architectural photography of a [Building Type] designed by Zaha Hadid. Blending brutalist concrete with lush vertical gardens. Mid-day golden hour sun casting soft shadows. 8K, HDR, wide-angle lens. Atmosphere: Utopian Solarpunk. Minimalist interior decoration.",
    "Logo & Branding Assets": "Professional minimalist vector logo for [Company Name]. Concept: [Metaphor/Symbol]. High-end branding aesthetic, balanced geometry, centered composition. 8K, flat design, clean lines. Trending on Behance/Dribbble. Colors: [Color Palette] with gold leaf accents.",
    "Stock Photography & Lifestyle": "Candid 8K lifestyle photograph of [People/Scene] at golden hour. Warm, nostalgic film grain (Kodak Portra 400 aesthetic). Natural lighting, soft bokeh. 35mm lens, high-fidelity textures. Professional commercial photography quality."
};

const finalImages = images.map(p => {
    if (!p.isPremium && imageUpgrades[p.category]) {
        return {
            ...p,
            content: imageUpgrades[p.category]
        };
    }
    return p;
});

fs.writeFileSync(IMAGE_PROMPTS_FILE, JSON.stringify(finalImages, null, 2));

console.log('Hero Upgrade Complete: 10 Text & 5 Image Heroes Enhanced.');
