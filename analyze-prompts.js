const fs = require('fs');
const path = require('path');

const CATEGORIES_DIR = path.join(__dirname, 'data', 'categories');
const IMAGE_PROMPTS = path.join(__dirname, 'data', 'image-prompts.json');

// CJK + Hangul ranges
const CJK_RE = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;

// System-instruction-like patterns at the beginning
const SYS_INSTR_PATTERNS = [
  /^PROMPT PURPOSE/i,
  /^CORE BEHAVIOR/i,
  /^Act as a/i,
  /^You are an AI/i,
  /^You are a /i,
  /^Your job is to/i,
];

function hasCJK(s) { return CJK_RE.test(s); }

function isShort(s) { return (s || '').trim().length < 20; }

function looksLikeSysInstruction(content) {
  const trimmed = (content || '').trimStart();
  return SYS_INSTR_PATTERNS.some(p => p.test(trimmed));
}

function loadFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`  [ERROR] Failed to read/parse ${filePath}: ${e.message}`);
    return null;
  }
}

// Collect all files
const categoryFiles = fs.readdirSync(CATEGORIES_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => path.join(CATEGORIES_DIR, f));
const allFiles = [...categoryFiles, IMAGE_PROMPTS];

// Global accumulators
const report = {
  files: {},
  totals: {
    totalPrompts: 0,
    cjkCount: 0,
    shortCount: 0,
    sysInstructionCount: 0,
  },
  top20Longest: [],
  samples: {},
};

const allLongest = []; // will hold { title, content, file }

for (const filePath of allFiles) {
  const fileName = path.basename(filePath);
  const data = loadFile(filePath);
  if (!data || !Array.isArray(data)) {
    report.files[fileName] = { error: 'Not a valid JSON array' };
    continue;
  }

  const fileInfo = {
    totalPrompts: data.length,
    cjkCount: 0,
    shortCount: 0,
    sysInstructionCount: 0,
    cjkTitles: [],
    shortTitles: [],
    sysInstructionTitles: [],
  };

  for (const item of data) {
    const title = item.title || '';
    const content = item.content || '';

    const hasCJ = hasCJK(title) || hasCJK(content);
    if (hasCJ) {
      fileInfo.cjkCount++;
      fileInfo.cjkTitles.push(title);
    }

    if (isShort(title) || isShort(content)) {
      fileInfo.shortCount++;
      fileInfo.shortTitles.push({ title, contentLen: content.trim().length });
    }

    if (looksLikeSysInstruction(content)) {
      fileInfo.sysInstructionCount++;
      fileInfo.sysInstructionTitles.push(title);
    }

    // Track for top 20 longest
    allLongest.push({ title, content, file: fileName });
  }

  report.files[fileName] = fileInfo;
  report.totals.totalPrompts += data.length;
  report.totals.cjkCount += fileInfo.cjkCount;
  report.totals.shortCount += fileInfo.shortCount;
  report.totals.sysInstructionCount += fileInfo.sysInstructionCount;
}

// Top 20 longest by content length
allLongest.sort((a, b) => (b.content || '').length - (a.content || '').length);
report.top20Longest = allLongest.slice(0, 20).map(item => ({
  title: (item.title || '').substring(0, 120),
  contentPreview: (item.content || '').substring(0, 100),
  contentLength: (item.content || '').length,
  file: item.file,
}));

// Sample 15 random prompts from each category file
for (const filePath of allFiles) {
  const fileName = path.basename(filePath);
  const data = loadFile(filePath);
  if (!data || !Array.isArray(data)) continue;
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, Math.min(15, shuffled.length));
  report.samples[fileName] = sample.map(item => ({
    title: (item.title || '').substring(0, 80),
    contentPreview: (item.content || '').substring(0, 120),
  }));
}

console.log(JSON.stringify(report, null, 2));
