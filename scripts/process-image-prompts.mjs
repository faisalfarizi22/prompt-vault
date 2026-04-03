import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'image-prompts.json');
const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

const translationMap = {
  'Technical Settings': 'Pengaturan Teknis',
  'Model:': 'Model:',
  'Aspect Ratio:': 'Rasio Aspek:',
  'Steps:': 'Steps:',
  'CFG Scale:': 'Skala CFG:',
  'Style:': 'Gaya:'
};

const processed = data.map(item => {
  let detail = item.detail || '';
  for (const [en, id] of Object.entries(translationMap)) {
    detail = detail.replace(en, id);
  }

  // Handle common style descriptions if they are simple enough
  detail = detail
    .replace('with neon color grading', 'dengan color grading neon')
    .replace('painterly with high luminosity', 'bergaya lukisan dengan luminositas tinggi')
    .replace('Hyper-realistic macro photography', 'Fotografi makro hiper-realistis')
    .replace('high contrast', 'kontras tinggi')
    .replace('warm palette', 'palet hangat')
    .replace('deep contrast', 'kontras dalam')
    .replace('Cinematic sci-fi concept art', 'Seni konsep fiksi ilmiah sinematik')
    .replace('Studio Ghibli meets photorealism', 'Studio Ghibli bertemu fotorealisme')
    .replace('Architectural documentary photography', 'Fotografi dokumenter arsitektur')
    .replace('Film photography, poetic minimalism', 'Fotografi film, minimalisme puitis')
    .replace('AAA game concept art, dramatic cinematic', 'Seni konsep game AAA, sinematik dramatis')
    .replace('High-end commercial product photography', 'Fotografi produk komersial kelas atas')
    .replace('Cinematic hyper-real mythology blend', 'Perpaduan mitologi hiper-nyata sinematik')
    .replace('Hyper-detailed nature macro, dark contrast', 'Makro alam sangat detail, kontras gelap')
    .replace('Hyperrealistic character portrait, dramatic chiaroscuro', 'Potret karakter hiperrealistik, chiaroscuro dramatis')
    .replace('Epic travel photography, natural light', 'Fotografi perjalanan epik, cahaya alami')
    .replace('Painted digital art, cinematic epic composition', 'Seni digital lukisan, komposisi epik sinematik')
    .replace('Hyper-realistic macro still life', 'Still life makro hiper-realistis')
    .replace('East Asian painting meets hyperrealism', 'Lukisan Asia Timur bertemu hiperrealisme')
    .replace('Abstract 3D digital art, ArtStation trending', 'Seni digital 3D abstrak, tren ArtStation')
    .replace('High fashion editorial, Vogue aesthetic', 'Editorial fashion kelas atas, estetika Vogue')
    .replace('Cinematic post-apocalyptic moodscape', 'Moodscape pasca-apokaliptik sinematik')
    .replace('2D painted animation, Ghibli warmth', 'Animasi lukisan 2D, kehangatan Ghibli')
    .replace('Old master oil painting simulation', 'Simulasi lukisan minyak master lama')
    .replace('Cinematic street photography, moody atmosphere', 'Fotografi jalanan sinematik, atmosfer moody')
    .replace('High-speed studio photography, commercial quality', 'Fotografi studio kecepatan tinggi, kualitas komersial')
    .replace('Adventure documentary photography', 'Fotografi dokumenter petualangan')
    .replace('Automotive commercial photography', 'Fotografi komersial otomotif')
    .replace('Whimsical macro world building', 'Membangun dunia makro yang aneh')
    .replace('Cinematic cosmic surrealism, Hubble-inspired', 'Surealisme kosmik sinematik, terinspirasi Hubble')
    .replace('Sumi-e meets cinematic hyperrealism', 'Sumi-e bertemu hiperrealisme sinematik')
    .replace('Painterly hyperrealism, architectural fantasy', 'Hiperrealisme lukisan, fantasi arsitektur')
    .replace('Award-winning nature macro photography', 'Fotografi makro alam pemenang penghargaan')
    .replace('High-fashion editorial, cyberpunk realism', 'Editorial fashion kelas atas, realisme cyberpunk')
    .replace('Medium format travel photography', 'Fotografi perjalanan format sedang')
    .replace('Dark romantic still life photography', 'Fotografi still life romantis gelap')
    .replace('Scientific visualization meets abstract fine art', 'Visualisasi ilmiah bertemu seni murni abstrak')
    .replace('Epic fantasy action concept art', 'Seni konsep aksi fantasi epik')
    .replace('Fine art architectural photography, natural light', 'Fotografi arsitektur seni murni, cahaya alami')
    .replace('Ukiyo-e meets cinematic realism', 'Ukiyo-e bertemu realisme sinematik')
    .replace('Architectural visualization, near-future luxury', 'Visualisasi arsitektur, kemewahan masa depan')
    .replace('Cinematic photorealistic space landscape', 'Lanskap ruang fotorealistik sinematik')
    .replace('Commercial food macro photography', 'Fotografi makro makanan komersial')
    .replace('Cinematic street photography with film grain', 'Fotografi jalanan sinematik dengan butiran film')
    .replace('Natural wonder photography, dramatic lighting', 'Fotografi keajaiban alam, pencahayaan dramatis')
    .replace('Cozy painterly landscape, magical realism', 'Lanskap lukisan nyaman, realisme magis')
    .replace('Epic historical painting meets cinematic realism', 'Lukisan sejarah epik bertemu realisme sinematik')
    .replace('3D surreal concept art, editorial quality', 'Seni konsep surealis 3D, kualitas editorial')
    .replace('Avant-garde fashion editorial, metallic realism', 'Editorial fashion avant-garde, realisme metalik')
    .replace('Architectural visualization, sacred futurism', 'Visualisasi arsitektur, futurisme sakral')
    .replace('Sci-fi cinematic horror, photorealistic', 'Horor sinematik fiksi ilmiah, fotorealistik')
    .replace('Hyperrealistic macro surrealism', 'Surealisme makro hiperrealistik')
    .replace('Fine art underwater photography', 'Fotografi bawah air seni murni');

  const newItem = {
    ...item,
    detail,
    contentId: item.contentIndonesia
  };
  delete newItem.contentIndonesia;
  return newItem;
});

fs.writeFileSync(filePath, JSON.stringify(processed, null, 2));
console.log('Processed image-prompts.json');
