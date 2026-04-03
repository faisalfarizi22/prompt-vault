import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Prompt {
  id: number;
  category: string;
  title: string;
  content: string;
  isPremium: boolean;
  tags?: string[];
  detail?: string;
  contentId?: string;
}

let cachedPrompts: Prompt[] | null = null;

function loadPrompts(): Prompt[] {
  // Always reload in development, cache in production
  if (cachedPrompts && process.env.NODE_ENV === 'production') return cachedPrompts;
  
  const dataDir = path.join(process.cwd(), 'data');
  const files = ['prompts.json', 'image-prompts.json'];
  
  let allData: Omit<Prompt, 'id'>[] = [];
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      allData = [...allData, ...data];
    }
  });

  cachedPrompts = allData.map((p, i) => ({ ...p, id: i + 1 }));
  return cachedPrompts;
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? '';
    const q = searchParams.get('q') ?? '';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '24', 10);

    let prompts = loadPrompts();

    // Filter by category
    if (category && category !== 'All') {
      prompts = prompts.filter((p) => p.category === category);
    }

    // Filter by search query
    if (q) {
      const lower = q.toLowerCase();
      prompts = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.content.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lower)))
      );
    }

    const total = prompts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = prompts.slice(start, start + limit);

    // Extract unique categories for sidebar
    const allPrompts = loadPrompts();
    const categories = Array.from(new Set(allPrompts.map((p) => p.category)));

    return NextResponse.json({ items, total, page, totalPages, categories });
  } catch (err) {
    console.error('Prompts API error:', err);
    return NextResponse.json({ error: 'Failed to load prompts' }, { status: 500 });
  }
}
