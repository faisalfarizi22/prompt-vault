/**
 * Script untuk membersihkan prompt berkualitas rendah dari hasil impor
 *
 * Yang dibersihkan:
 * 1. Prompt dengan judul/konten terlalu pendek (< 20 karakter)
 * 2. Prompt dengan karakter CJK (China/Jepang/Korea) — hasil encoding error
 * 3. Prompt yang kontennya hanya karakter aneh / tidak terbaca
 * 4. Prompt duplikat antar kategori
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CATEGORIES_DIR = path.join(DATA_DIR, "categories");
const IMAGE_PROMPTS_FILE = path.join(DATA_DIR, "image-prompts.json");

// Regex untuk deteksi karakter CJK
const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\uff00-\uffef\u3000-\u303f]/;

// Regex untuk deteksi binary/mojibake (karakter aneh di luar ASCII normal)
const MOJIBAKE_REGEX = /[\x00-\x08\x0b\x0c\x0e-\x1f\uFFF0-\uFFFF]/;

// Regex untuk konten yang hanya berisi karakter acak (rasio huruf normal rendah)
function isGarbledContent(text) {
  if (!text || text.length < 10) return true;

  // Hitung rasio karakter alfabet/spasi normal
  const normal = text.replace(/[a-zA-Z0-9\s.,!?;:'"()\-_\[\]{}@#$%^&*+=/\\|<>~`]/g, "");
  const ratio = normal.length / text.length;

  // Jika > 40% karakter "aneh", anggap garbled
  return ratio > 0.4;
}

function hasCJK(text) {
  return CJK_REGEX.test(text);
}

function hasMojiBake(text) {
  return MOJIBAKE_REGEX.test(text);
}

function cleanPrompts(prompts, fileName) {
  const before = prompts.length;
  const removed = { short: 0, cjk: 0, garbled: 0, mojibake: 0, nearDup: 0 };
  const seen = new Set();

  const cleaned = prompts.filter((p) => {
    const title = (p.title || "").trim();
    const content = (p.content || "").trim();

    // 1. Judul terlalu pendek
    if (title.length < 3) {
      removed.short++;
      return false;
    }

    // 2. Konten terlalu pendek
    if (content.length < 20) {
      removed.short++;
      return false;
    }

    // 3. Mengandung karakter CJK (China/Jepang/Korea)
    if (hasCJK(title) || hasCJK(content)) {
      removed.cjk++;
      return false;
    }

    // 4. Mengandung binary/mojibake
    if (hasMojiBake(title) || hasMojiBake(content)) {
      removed.mojibake++;
      return false;
    }

    // 5. Konten garbled (rasio karakter aneh tinggi)
    if (isGarbledContent(content)) {
      removed.garbled++;
      return false;
    }

    // 6. Judul garbled
    if (isGarbledContent(title)) {
      removed.garbled++;
      return false;
    }

    // 7. Duplikat dalam file yang sama (berdasarkan judul case-insensitive)
    const key = title.toLowerCase();
    if (seen.has(key)) {
      removed.nearDup++;
      return false;
    }
    seen.add(key);

    return true;
  });

  if (before !== cleaned.length) {
    console.log(
      `   ✂️  ${fileName}: ${before} → ${cleaned.length} prompt ` +
      `(short:${removed.short} cjk:${removed.cjk} moji:${removed.mojibake} ` +
      `garbled:${removed.garbled} dup:${removed.nearDup})`
    );
  }

  return cleaned;
}

function processFile(filePath, fileName) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const prompts = JSON.parse(raw);

  if (!Array.isArray(prompts) || prompts.length === 0) return;

  const cleaned = cleanPrompts(prompts, fileName);
  cleaned.sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), "utf-8");
}

function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🧹  MEMBERSIHKAN PROMPT KUALITAS RENDAH ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Proses semua file kategori
  console.log("📋 Membersihkan file kategori...");
  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    processFile(path.join(CATEGORIES_DIR, file), file);
  }

  // Proses image-prompts.json
  console.log("\n🖼️  Membersihkan image-prompts...");
  if (fs.existsSync(IMAGE_PROMPTS_FILE)) {
    processFile(IMAGE_PROMPTS_FILE, "image-prompts.json");
  }

  // Hitung total akhir
  console.log("\n📊 Ringkasan akhir:");
  let total = 0;
  const finalFiles = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of finalFiles) {
    const filePath = path.join(CATEGORIES_DIR, file);
    const prompts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    total += prompts.length;
    console.log(`   📁 ${file} → ${prompts.length} prompt`);
  }

  if (fs.existsSync(IMAGE_PROMPTS_FILE)) {
    const imgPrompts = JSON.parse(fs.readFileSync(IMAGE_PROMPTS_FILE, "utf-8"));
    console.log(`   🖼️  image-prompts.json → ${imgPrompts.length} prompt`);
    total += imgPrompts.length;
  }

  console.log(`\n✅ Total akhir: ${total} prompt`);
}

main();
