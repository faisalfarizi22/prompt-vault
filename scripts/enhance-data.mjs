import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../data/prompts.json');

async function main() {
  console.log('🚀 Starting Offline Data Enhancement (Tags, Details, Fallback Translations)...');
  
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  let prompts = JSON.parse(rawData);
  console.log(`Loaded ${prompts.length} prompts.`);

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    
    // --- 1. AUTO TAGGING ---
    const tags = new Set();
    const haystack = (p.title + " " + p.content + " " + (p.category || '')).toLowerCase();
    
    if (haystack.includes('tiktok') || haystack.includes('reels') || haystack.includes('shorts')) tags.add('Short Video');
    if (haystack.includes('seo') || haystack.includes('article') || haystack.includes('blog')) tags.add('SEO');
    if (haystack.includes('copywriting') || haystack.includes('sales') || haystack.includes('hook')) tags.add('Copywriting');
    if (haystack.includes('python') || haystack.includes('code') || haystack.includes('react')) tags.add('Coding');
    if (haystack.includes('midjourney') || haystack.includes('prompt') || haystack.includes('image')) tags.add('Image Gen');
    if (haystack.includes('cyber') || haystack.includes('punk') || haystack.includes('neon')) tags.add('Cyberpunk');
    if (haystack.includes('business') || haystack.includes('startup') || haystack.includes('marketing')) tags.add('Business');
    if (haystack.includes('youtube') || haystack.includes('video')) tags.add('YouTube');
    if (haystack.includes('email') || haystack.includes('newsletter')) tags.add('Email');
    if (haystack.includes('funnel') || haystack.includes('landing page')) tags.add('Funnel');
    if (haystack.includes('creative') || haystack.includes('write')) tags.add('Creative');
    if (haystack.includes('analyze') || haystack.includes('data')) tags.add('Analysis');

    if (p.category) {
       const catBase = p.category.split(' ')[0].replace(/[^a-zA-Z]/g, '');
       if (catBase && catBase.length > 2) tags.add(catBase);
    }
    
    if (tags.size === 0) tags.add('General');

    p.tags = Array.from(tags).slice(0, 4); // Max 4 tags
    
    // --- 2. AUTO DETAIL ---
    p.detail = `Prompt ini telah dioptimalkan untuk ChatGPT, Claude, dan Gemini. Menggunakan pola pemrosesan bahasa alami tingkat lanjut yang dirancang khusus untuk kasus penggunaan ${p.tags[0] || 'umum'}. Ganti semua kata dalam tanda kurung siku seperti [masukkan] dengan konteks spesifik Anda untuk hasil terbaik.`;

    // --- 3. AUTO TRANSLATE FALLBACK ---
    let translated = p.content
        .replace(/\bWrite\b/g, 'Tulis')
        .replace(/\bwrite\b/g, 'tulis')
        .replace(/\bCreate\b/g, 'Buat')
        .replace(/\bcreate\b/g, 'buat')
        .replace(/\bGenerate\b/g, 'Hasilkan')
        .replace(/\bgenerate\b/g, 'hasilkan')
        .replace(/\bfor\b/g, 'untuk')
        .replace(/\byour\b/g, 'Anda')
        .replace(/\bYour\b/g, 'Anda')
        .replace(/\band\b/g, 'dan')
        .replace(/\bAnd\b/g, 'Dan')
        .replace(/\babout\b/g, 'tentang')
        .replace(/\bAbout\b/g, 'Tentang')
        .replace(/\bwith\b/g, 'dengan')
        .replace(/\bWith\b/g, 'Dengan')
        .replace(/\bthat\b/g, 'yang')
        .replace(/\busing\b/g, 'menggunakan')
        .replace(/\binclude\b/g, 'sertakan')
        .replace(/\bfocus\b/g, 'fokus')
        .replace(/\bmake\b/g, 'buat');

    p.contentId = translated;
  }

  // Write back
  fs.writeFileSync(DATA_PATH, JSON.stringify(prompts, null, 2));
  console.log('\n✅ Data Enhancement Complete! Saved to prompts.json');
}

main().catch(console.error);
