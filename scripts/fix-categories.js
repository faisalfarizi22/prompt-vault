/**
 * Script untuk merapikan kategori hasil impor dari prompts.chat
 *
 * Fungsi:
 * 1. Memproses prompt yang tidak terkategori → kategorikan berdasarkan konten/tags
 * 2. Menggabungkan file kategori yang terlalu kecil ke kategori yang lebih besar
 * 3. Menghapus file kosong
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CATEGORIES_DIR = path.join(DATA_DIR, "categories");

// Kata kunci untuk mendeteksi kategori dari judul/konten/tags
const KEYWORD_RULES = [
  {
    target: "Coding & Programming",
    keywords: [
      "code", "programming", "javascript", "python", "typescript", "react",
      "node", "api", "function", "algorithm", "debug", "software",
      "developer", "coding", "app", "web", "html", "css", "sql",
      "database", "git", "github", "terminal", "bash", "script",
      "docker", "kubernetes", "deploy", "server", "backend", "frontend",
      "full-stack", "framework", "library", "npm", "component",
      "sponsor", "readme", "ghost", "cfml", "coldfusion", "lucee",
      "vscode", "ide", "snippet", "module", "package",
    ],
  },
  {
    target: "Writing & Content Creation",
    keywords: [
      "write", "blog", "article", "essay", "story", "content",
      "copywrite", "narrative", "paragraph", "edit", "proofread",
      "grammar", "translate", "translation", "journalism",
      "newsletter", "publish", "author", "writer", "book",
      "summarize", "summarizer", "outline", "chapter",
    ],
  },
  {
    target: "Business & Strategy",
    keywords: [
      "business", "startup", "entrepreneur", "strategy", "plan",
      "management", "leadership", "project", "stakeholder",
      "roadmap", "goal", "kpi", "okr", "agile", "scrum",
      "consulting", "client", "revenue", "growth", "scale",
      "investor", "pitch", "funding", "capital", "partnership",
      "community", "building a community",
    ],
  },
  {
    target: "Learning & Education",
    keywords: [
      "learn", "study", "course", "lesson", "tutor", "teach",
      "education", "student", "class", "homework", "exam",
      "curriculum", "training", "skill", "knowledge",
      "explain", "understand", "practice", "exercise",
      "flashcard", "mnemonic", "academic", "lecture",
      "babysit", "parenting", "parent",
    ],
  },
  {
    target: "Marketing & Sales",
    keywords: [
      "marketing", "sales", "seo", "social media", "campaign",
      "brand", "advertise", "promotion", "funnel", "conversion",
      "audience", "lead", "customer", "market", "growth hack",
      "viral", "engagement", "retention", "acquisition",
    ],
  },
  {
    target: "Design & Creative",
    keywords: [
      "design", "ui", "ux", "graphic", "illustration", "color",
      "typography", "branding", "logo", "mockup", "prototype",
      "figma", "photoshop", "sketch", "wireframe", "creative",
      "art", "visual", "aesthetic", "layout", "style",
      "game", "gaming", "play", "fun", "quiz", "trivia", "riddle", "puzzle",
      "anime", "manga", "drawing", "paint",
    ],
  },
  {
    target: "Personal Development",
    keywords: [
      "habit", "routine", "productivity", "focus", "mindset",
      "goal", "motivation", "self", "improve", "growth",
      "time management", "discipline", "meditation", "journal",
      "reflection", "gratitude", "mindfulness", "organization",
      "career", "coach", "mentor", "advice", "therapy",
      "counsel", "mental", "stress", "anxiety", "depression",
      "aphorism", "philosophy",
    ],
  },
  {
    target: "Data Science & AI",
    keywords: [
      "data science", "machine learning", "ai", "artificial intelligence",
      "deep learning", "neural network", "analytics", "statistics",
      "prediction", "classification", "regression", "dataset",
      "pandas", "numpy", "tensorflow", "pytorch", "model",
      "nlp", "computer vision", "recommendation",
      "bank transaction", "analysis",
    ],
  },
  {
    target: "Food & Lifestyle",
    keywords: [
      "recipe", "cook", "food", "meal", "kitchen", "dinner", "breakfast",
      "calorie", "diet", "nutrition", "ayurveda", "tester",
      "vegan", "keto", "ingredient",
    ],
  },
  {
    target: "Travel & Culture",
    keywords: [
      "travel", "vacation", "trip", "holiday", "destination", "tour",
      "hotel", "flight", "booking", "itinerary", "culture",
      "language", "english", "vocabulary", "speak", "pronounce",
      "polyglot", "translation",
    ],
  },
  {
    target: "Legal & Finance",
    keywords: [
      "law", "legal", "contract", "license", "claim", "insurance",
      "court", "attorney", "lawyer", "judicial", "defense", "memoranda",
      "invest", "stock", "crypto", "trading", "market analysis",
      "finance", "budget", "accounting", "tax",
    ],
  },
];

// Mapping: category slug from prompts.chat → target category
// Untuk prompt yang punya category tapi tidak termapping di script utama
const CATEGORY_SLUG_MAP = {
  "uncategorized": null, // akan diproses via keyword
  "course-creation": "Learning & Education",
  "mindset-motivation": "Personal Development",
  "productivity": "Personal Development",
  "self-improvement": "Personal Development",
  "note-taking": "Personal Development",
  "github-sponsors-profile": "Coding & Programming",
  "career": "Personal Development",
  "games": "Design & Creative",
  "gaming": "Design & Creative",
};

// Merge: file kecil digabung ke kategori utama
const CATEGORY_MERGE = {
  "course-creation.json": "learning-education.json",
  "mindset-motivation.json": "personal-development.json",
  "productivity.json": "personal-development.json",
  "self-improvement.json": "personal-development.json",
  "note-taking.json": "personal-development.json",
  "github-sponsors-profile.json": "coding-programming.json",
  "startup-entrepreneurship.json": "business-strategy.json",
  "devops-infrastructure.json": "coding-programming.json",
  "kids-early-learning.json": "learning-education.json",
  "research-analysis.json": "data-science-ai.json",
  "marketing-sales.json": "high-converting-copywriting-fb-ig-ads.json",
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FALLBACK_CATEGORY = "General & Miscellaneous";

function assignByKeywords(prompt, minScore = 1) {
  const haystack = (prompt.title + " " + (prompt.content || "") + " " + (prompt.tags || []).join(" ")).toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const rule of KEYWORD_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (haystack.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.target;
    }
  }

  return bestScore >= minScore ? bestMatch : null;
}

function processFile(fileName) {
  const filePath = path.join(CATEGORIES_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  let prompts = JSON.parse(raw);
  let modified = false;

  const newPrompts = [];

  for (const p of prompts) {
    let targetCategory = null;

    // Cek kategori asli dari prompts.chat (ada di tags)
    const originalSlug = (p.tags || [])
      .map((t) => slugify(t))
      .find((s) => CATEGORY_SLUG_MAP[s] !== undefined);

    if (originalSlug && CATEGORY_SLUG_MAP[originalSlug]) {
      targetCategory = CATEGORY_SLUG_MAP[originalSlug];
    } else if (fileName === "uncategorized.json") {
      // Coba kategorikan via keywords
      targetCategory = assignByKeywords(p);
    }

    if (targetCategory) {
      p.category = targetCategory;
      p.tags = p.tags || [];
      modified = true;
    }

    newPrompts.push(p);
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(newPrompts, null, 2), "utf-8");
  }

  return { count: newPrompts.length, modified };
}

function mergeSmallFiles() {
  for (const [smallFile, targetFile] of Object.entries(CATEGORY_MERGE)) {
    const smallPath = path.join(CATEGORIES_DIR, smallFile);
    const targetPath = path.join(CATEGORIES_DIR, targetFile);

    if (!fs.existsSync(smallPath)) continue;
    if (!fs.existsSync(targetPath)) continue;

    const smallPrompts = JSON.parse(fs.readFileSync(smallPath, "utf-8"));
    const targetPrompts = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

    // Cegah duplikasi
    const targetTitles = new Set(targetPrompts.map((p) => p.title.trim().toLowerCase()));
    let merged = 0;

    for (const p of smallPrompts) {
      if (!targetTitles.has(p.title.trim().toLowerCase())) {
        // Update category sesuai target file
        const targetCategory = targetPrompts[0]?.category || "Coding & Programming";
        p.category = targetCategory;
        targetPrompts.push(p);
        targetTitles.add(p.title.trim().toLowerCase());
        merged++;
      }
    }

    targetPrompts.sort((a, b) => a.title.localeCompare(b.title));
    fs.writeFileSync(targetPath, JSON.stringify(targetPrompts, null, 2), "utf-8");
    fs.unlinkSync(smallPath);

    console.log(`   🔀 ${smallFile} (${smallPrompts.length}) → ${targetFile} (${merged} digabung)`);
  }
}

function distributeUncategorized() {
  const uncatPath = path.join(CATEGORIES_DIR, "uncategorized.json");
  if (!fs.existsSync(uncatPath)) return;

  const uncatPrompts = JSON.parse(fs.readFileSync(uncatPath, "utf-8"));
  const distributed = {};

  let assigned = 0;
  let unassigned = 0;

  for (const p of uncatPrompts) {
    const target = assignByKeywords(p);
    if (target) {
      if (!distributed[target]) distributed[target] = [];
      p.category = target;
      distributed[target].push(p);
      assigned++;
    } else {
      unassigned++;
    }
  }

  // Tulis ke file kategori masing-masing
  for (const [catName, prompts] of Object.entries(distributed)) {
    const targetFile = slugify(catName) + ".json";
    const targetPath = path.join(CATEGORIES_DIR, targetFile);

    let existing = [];
    if (fs.existsSync(targetPath)) {
      existing = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    }

    const existingTitles = new Set(existing.map((p) => p.title.trim().toLowerCase()));
    let added = 0;

    for (const p of prompts) {
      if (!existingTitles.has(p.title.trim().toLowerCase())) {
        existing.push(p);
        existingTitles.add(p.title.trim().toLowerCase());
        added++;
      }
    }

    existing.sort((a, b) => a.title.localeCompare(b.title));
    fs.writeFileSync(targetPath, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`   📦 ${prompts.length} prompt → ${catName} (${added} baru)`);
  }

  // Sisanya → General & Miscellaneous
  const remaining = uncatPrompts.filter((p) => !assignByKeywords(p));
  if (remaining.length > 0) {
    const miscFile = slugify(FALLBACK_CATEGORY) + ".json";
    const miscPath = path.join(CATEGORIES_DIR, miscFile);

    let existing = [];
    if (fs.existsSync(miscPath)) {
      existing = JSON.parse(fs.readFileSync(miscPath, "utf-8"));
    }

    const existingTitles = new Set(existing.map((p) => p.title.trim().toLowerCase()));
    let added = 0;
    for (const p of remaining) {
      if (!existingTitles.has(p.title.trim().toLowerCase())) {
        p.category = FALLBACK_CATEGORY;
        existing.push(p);
        existingTitles.add(p.title.trim().toLowerCase());
        added++;
      }
    }
    existing.sort((a, b) => a.title.localeCompare(b.title));
    fs.writeFileSync(miscPath, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`   📦 ${remaining.length} prompt → ${FALLBACK_CATEGORY} (${added} baru)`);
  }

  // Hapus uncategorized.json karena semua prompt sudah didistribusikan
  if (fs.existsSync(uncatPath)) {
    fs.unlinkSync(uncatPath);
    console.log("   🗑️  uncategorized.json dihapus");
  }

  return { assigned, unassigned };
}

function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🔧  MERAPIKAN KATEGORI + MENGGABUNGKAN ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // 1. Proses file yang perlu dikategorikan ulang
  console.log("📋 Memproses kategori...");
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const result = processFile(file);
    if (result.modified) {
      console.log(`   ✏️  ${file} (${result.count} prompt - diperbarui)`);
    }
  }

  // 2. Distribusikan uncategorized
  console.log("\n📦 Mendistribusikan uncategorized.json...");
  distributeUncategorized();

  // 3. Gabungkan file kecil
  console.log("\n🔀 Menggabungkan file kategori kecil...");
  mergeSmallFiles();

  // 4. Hapus file kategori yang masih kosong
  console.log("\n🧹 Membersihkan file kosong...");
  const remainingFiles = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of remainingFiles) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const prompts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (prompts.length === 0) {
      fs.unlinkSync(filePath);
      console.log(`   🗑️  ${file} (kosong)`);
    }
  }

  // 5. Hitung total
  console.log("\n📊 Ringkasan akhir:");
  const finalFiles = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  let total = 0;
  for (const file of finalFiles) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const prompts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    total += prompts.length;
    console.log(`   📁 ${file} → ${prompts.length} prompt`);
  }
  console.log(`\n✅ Total: ${total} prompt dalam ${finalFiles.length} kategori`);

  // Hitung juga image-prompts
  const imgPath = path.join(DATA_DIR, "image-prompts.json");
  if (fs.existsSync(imgPath)) {
    const imgPrompts = JSON.parse(fs.readFileSync(imgPath, "utf-8"));
    console.log(`   🖼️  image-prompts.json → ${imgPrompts.length} prompt`);
    total += imgPrompts.length;
  }
  console.log(`\n🎯 Grand total: ${total} prompt`);
}

main();
