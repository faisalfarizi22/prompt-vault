/**
 * Script Impor Prompt dari prompts.chat
 *
 * Cara pakai:
 *   cd prompt-bank
 *   node scripts/import-from-prompts-chat.js
 *
 * Script ini akan:
 * 1. Ambil semua prompt dari API prompts.chat (dengan pagination)
 * 2. Petakan kategorinya ke kategori Veloprome yang sudah ada
 * 3. Buat file kategori baru untuk yang belum ada
 * 4. Gabungkan dengan data existing (tanpa duplikasi)
 * 5. Hapus prompt duplikat berdasarkan judul yang sama
 */
const fs = require("fs");
const path = require("path");

// ============================================================
// 1. KONFIGURASI
// ============================================================

const API_BASE = "https://prompts.chat/prompts.json";
const DATA_DIR = path.join(__dirname, "..", "data");
const CATEGORIES_DIR = path.join(DATA_DIR, "categories");
const IMAGE_PROMPTS_FILE = path.join(DATA_DIR, "image-prompts.json");

// Mapping: prompts.chat category → Veloprome category name
// Set ke null jika ingin dibuat kategori baru
const CATEGORY_MAPPING = {
  // → Existing Veloprome Categories
  "image-generation": "Image Generation",
  "copywriting": "High-Converting Copywriting (FB/IG Ads)",
  "marketing": "High-Converting Copywriting (FB/IG Ads)",
  "marketing-sales": "High-Converting Copywriting (FB/IG Ads)",
  "sales": "High-Converting Copywriting (FB/IG Ads)",
  "email-communication": "Email Marketing & FOMO Newsletters",
  "video-generation": "YouTube / Long Video Scripting",
  "market-analysis": "Market Research & Competitor Analysis",
  "market-research": "Market Research & Competitor Analysis",
  "research-analysis": "Market Research & Competitor Analysis",
  "creative": "Storytelling & Emotional Selling",
  "writing": "Storytelling & Emotional Selling",

  // → NEW Categories (tidak ada mapping ke existing, akan buat file baru)
  "coding": null,
  "web-development": null,
  "mobile-development": null,
  "data-science": null,
  "devops": null,
  "vibe": null,
  "skill": null,
  "agent-workflows": null,
  "automations": null,
  "automation-workflows": null,
  "workflows": null,
  "business": null,
  "business-planning": null,
  "business-strategy": null,
  "startup-entrepreneurship": null,
  "academic-writing": null,
  "technical-writing": null,
  "blog-writing": null,
  "stem-science": null,
  "learning-skills": null,
  "language-learning": null,
  "tutoring-homework-help": null,
  "exam-preparation": null,
  "education": null,
  "teaching-instruction": null,
  "leadership-management": null,
  "meeting-collaboration": null,
  "hr": null,
  "finance-budgeting": null,
  "health-wellness": null,
  "music": null,
  "kids-early-learning": null,
  "habits-routines": null,
  "journaling-reflection": null,
  "design": null,
  "personal-branding": null,
  "customer-service": null,
  "content-ideas": null,
  "storytelling": null,
  "product-launch": null,
  "tiktok": null
};

// Nama kategori baru untuk yang tidak termapping
const NEW_CATEGORY_NAMES = {
  "coding": "Coding & Programming",
  "web-development": "Coding & Programming",
  "mobile-development": "Coding & Programming",
  "data-science": "Data Science & AI",
  "devops": "DevOps & Infrastructure",
  "vibe": "Coding & Programming",
  "skill": "AI Agent & Workflows",
  "agent-workflows": "AI Agent & Workflows",
  "automations": "AI Agent & Workflows",
  "automation-workflows": "AI Agent & Workflows",
  "workflows": "AI Agent & Workflows",
  "business": "Business & Strategy",
  "business-planning": "Business & Strategy",
  "business-strategy": "Business & Strategy",
  "startup-entrepreneurship": "Startup & Entrepreneurship",
  "academic-writing": "Writing & Content Creation",
  "technical-writing": "Writing & Content Creation",
  "blog-writing": "Writing & Content Creation",
  "stem-science": "Research & Analysis",
  "learning-skills": "Learning & Education",
  "language-learning": "Learning & Education",
  "tutoring-homework-help": "Learning & Education",
  "exam-preparation": "Learning & Education",
  "education": "Learning & Education",
  "teaching-instruction": "Learning & Education",
  "leadership-management": "Leadership & HR",
  "meeting-collaboration": "Leadership & HR",
  "hr": "Leadership & HR",
  "finance-budgeting": "Finance & Accounting",
  "health-wellness": "Health & Wellness",
  "music": "Music & Audio",
  "kids-early-learning": "Kids & Early Learning",
  "habits-routines": "Personal Development",
  "journaling-reflection": "Personal Development",
  "design": "Design & Creative",
  "personal-branding": "Personal Branding",
  "customer-service": "Customer Service & Communication",
  "content-ideas": "Content Ideas & Planning",
  "storytelling": "Storytelling & Narrative",
  "product-launch": "Product Launch & Growth",
  "tiktok": "TikTok & Short Video",
  "tiktok-affiliate": "TikTok & Short Video"
};

// Slug untuk nama file kategori baru
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================================
// 2. LOAD DATA EXISTING
// ============================================================

function loadExistingData() {
  const existing = {};

  // Load dari folder categories
  if (fs.existsSync(CATEGORIES_DIR)) {
    const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(CATEGORIES_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const prompts = JSON.parse(raw);
      for (const p of prompts) {
        const key = p.title.trim().toLowerCase();
        existing[key] = p;
      }
    }
  }

  // Load dari image-prompts.json
  if (fs.existsSync(IMAGE_PROMPTS_FILE)) {
    const raw = fs.readFileSync(IMAGE_PROMPTS_FILE, "utf-8");
    const prompts = JSON.parse(raw);
    for (const p of prompts) {
      const key = p.title.trim().toLowerCase();
      existing[key] = p;
    }
  }

  console.log(`📦 Data existing: ${Object.keys(existing).length} prompt`);
  return existing;
}

// ============================================================
// 3. FETCH DARI API PROMPTS.CHAT
// ============================================================

async function fetchAllPrompts() {
  const allPrompts = [];
  let page = 1;
  let hasMore = true;
  let totalCount = 0;

  console.log("🌐 Mengambil prompt dari prompts.chat...");

  while (hasMore) {
    const url = `${API_BASE}?page=${page}&limit=100&full_content=true`;
    console.log(`   Halaman ${page}...`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal fetch halaman ${page}: ${response.status}`);
    }

    const data = await response.json();
    totalCount = data.count;

    for (const p of data.prompts) {
      allPrompts.push(p);
    }

    hasMore = data.hasMore;
    page++;

    // Jeda biar ga kena rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`✅ Total ${allPrompts.length} prompt dari ${totalCount} (API)`);
  return allPrompts;
}

// ============================================================
// 4. PROSES & KELOMPOKKAN
// ============================================================

function processPrompts(rawPrompts, existingData) {
  const byCategory = {}; // { categoryName: [prompts] }
  const imagePrompts = [];
  let mapped = 0;
  let newCat = 0;
  let skipped = 0;
  let deduped = 0;

  for (const p of rawPrompts) {
    // Skip kalo ga punya content
    if (!p.content || p.content.trim().length < 10) {
      skipped++;
      continue;
    }

    // Cek duplikasi berdasarkan judul (case-insensitive)
    const titleKey = p.title.trim().toLowerCase();
    if (existingData[titleKey]) {
      deduped++;
      continue;
    }

    // Tentukan kategori tujuan
    const catSlug = p.category?.slug || "uncategorized";
    let targetCategory = CATEGORY_MAPPING[catSlug];

    let isExistingCategory = true;
    if (targetCategory === undefined || targetCategory === null) {
      // Category tidak dikenal → buat baru
      targetCategory = NEW_CATEGORY_NAMES[catSlug] || p.category?.name || "Uncategorized";
      isExistingCategory = false;
    }

    // Cek apakah ini image prompt
    const isImage =
      p.type === "IMAGE" ||
      targetCategory === "Image Generation" ||
      (p.tags || []).some((t) =>
        ["image-generation", "image", "dall-e", "midjourney", "stable-diffusion"].includes(
          t.slug || t.name?.toLowerCase().replace(/\s+/g, "-")
        )
      );

    // Buat object prompt sesuai format Veloprome
    const tags = (p.tags || []).map((t) => t.name || t.slug || t);
    if (p.category?.name) {
      tags.unshift(p.category.name);
    }

    const newPrompt = {
      category: targetCategory,
      title: p.title,
      content: p.content,
      isPremium: false,
      tags: [...new Set(tags)],
      detail: `### 📝 Prompt dari prompts.chat\n\nPrompt ini diambil dari perpustakaan prompts.chat — komunitas open-source. Dapat digunakan untuk berbagai platform AI (ChatGPT, Claude, Gemini, dll).\n\n**Deskripsi:** ${p.description || "Tidak ada deskripsi"}\n\n**Kategori asal:** ${p.category?.name || "Tidak dikategorikan"}\n**Penulis:** ${p.author?.name || p.author?.username || "Anonim"}`,
    };

    if (isImage) {
      imagePrompts.push(newPrompt);
    } else {
      if (!byCategory[targetCategory]) {
        byCategory[targetCategory] = [];
      }
      byCategory[targetCategory].push(newPrompt);
    }

    // Catat di existing supaya tidak digandakan dalam batch yang sama
    existingData[titleKey] = newPrompt;

    if (isExistingCategory) {
      mapped++;
    } else {
      newCat++;
    }
  }

  console.log(`\n📊 Hasil proses:`);
  console.log(`   - ${mapped} prompt → kategori existing`);
  console.log(`   - ${newCat} prompt → kategori baru`);
  console.log(`   - ${skipped} prompt dilewati (konten pendek)`);
  console.log(`   - ${deduped} duplikat diabaikan`);
  console.log(`   - ${imagePrompts.length} prompt gambar`);

  return { byCategory, imagePrompts };
}

// ============================================================
// 5. GABUNGKAN & SIMPAN
// ============================================================

function saveCategories(byCategory) {
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }

  // Hapus data kategori yang ada
  const existingFiles = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  const existingCategoryNames = new Set();

  for (const file of existingFiles) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const prompts = JSON.parse(raw);
    // Ambil nama kategori dari data
    for (const p of prompts) {
      if (p.category) {
        existingCategoryNames.add(p.category);
        break;
      }
    }
  }

  // Gabungkan prompt lama + baru per kategori
  const merged = {};

  // 1. Load kategori existing
  for (const file of existingFiles) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const prompts = JSON.parse(raw);
    const catName = prompts[0]?.category || "Unknown";
    if (!merged[catName]) {
      merged[catName] = [];
    }
    merged[catName].push(...prompts);
  }

  // 2. Tambah prompt baru
  for (const [catName, prompts] of Object.entries(byCategory)) {
    if (!merged[catName]) {
      merged[catName] = [];
    }

    // Cegah duplikasi judul dalam kategori yang sama
    const existingTitles = new Set(merged[catName].map((p) => p.title.trim().toLowerCase()));
    for (const p of prompts) {
      if (!existingTitles.has(p.title.trim().toLowerCase())) {
        merged[catName].push(p);
        existingTitles.add(p.title.trim().toLowerCase());
      }
    }
  }

  // 3. Hapus file kategori yang ada
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(CATEGORIES_DIR, file));
  }

  // 4. Tulis kategori
  let totalSaved = 0;
  for (const [catName, prompts] of Object.entries(merged)) {
    const fileName = slugify(catName) + ".json";
    const filePath = path.join(CATEGORIES_DIR, fileName);
    // Sort by title
    prompts.sort((a, b) => a.title.localeCompare(b.title));
    fs.writeFileSync(filePath, JSON.stringify(prompts, null, 2), "utf-8");
    totalSaved += prompts.length;
    console.log(`   📁 ${fileName} → ${prompts.length} prompt`);
  }

  return totalSaved;
}

function saveImagePrompts(newImagePrompts) {
  if (newImagePrompts.length === 0) return 0;

  let existing = [];
  if (fs.existsSync(IMAGE_PROMPTS_FILE)) {
    const raw = fs.readFileSync(IMAGE_PROMPTS_FILE, "utf-8");
    existing = JSON.parse(raw);
  }

  // Cegah duplikasi
  const existingTitles = new Set(existing.map((p) => p.title.trim().toLowerCase()));
  for (const p of newImagePrompts) {
    if (!existingTitles.has(p.title.trim().toLowerCase())) {
      existing.push(p);
      existingTitles.add(p.title.trim().toLowerCase());
    }
  }

  // Sort
  existing.sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(IMAGE_PROMPTS_FILE, JSON.stringify(existing, null, 2), "utf-8");

  console.log(`   📁 image-prompts.json → ${existing.length} prompt`);
  return existing.length;
}

// ============================================================
// 6. EKSEKUSI
// ============================================================

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🚀 IMPOR PROMPT DARI PROMPTS.CHAT      ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const startTime = Date.now();

  // Load existing
  const existingData = loadExistingData();

  // Fetch dari API
  let rawPrompts;
  try {
    rawPrompts = await fetchAllPrompts();
  } catch (err) {
    console.error("❌ Gagal fetch dari API:", err.message);
    console.log("\n⚠️  Gunakan mode offline (data dari clone repo)...");

    // Fallback: coba load dari hasil clone
    const localData = path.join(
      __dirname,
      "..",
      "..",
      "AppData",
      "Local",
      "Temp",
      "opencode",
      "prompts-chat",
      "src",
      "app",
      "prompts.json"
    );
    if (fs.existsSync(localData)) {
      rawPrompts = JSON.parse(fs.readFileSync(localData, "utf-8"));
      rawPrompts = rawPrompts.prompts || rawPrompts;
    } else {
      console.error("❌ Tidak ada data lokal. Script gagal.");
      process.exit(1);
    }
  }

  // Proses
  const { byCategory, imagePrompts } = processPrompts(rawPrompts, existingData);

  // Simpan
  console.log("\n💾 Menyimpan ke file...");
  const textSaved = saveCategories(byCategory);
  const imgSaved = saveImagePrompts(imagePrompts);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Selesai dalam ${duration} detik!`);
  console.log(`   📊 Total: ${textSaved + imgSaved} prompt tersimpan`);
  console.log(`      - ${textSaved} prompt teks`);
  console.log(`      - ${imgSaved} prompt gambar`);

  // Hapus file kategori kosong
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const prompts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (prompts.length === 0) {
      fs.unlinkSync(filePath);
      console.log(`   🗑️  Hapus file kosong: ${file}`);
    }
  }
}

main().catch(console.error);
