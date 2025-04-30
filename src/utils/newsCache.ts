import fs from "fs";

export function loadCachedNews(): string[] {
  // save the id instead
  const filePath = "cached/news.json";

  if (!fs.existsSync("cached")) {
    fs.mkdirSync("cached");
  }

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  fs.writeFileSync(filePath, "[]");
  return [];
}

export function loadNewsCachedLinks(): NewsType[] {
  const filePath = "cached/news-new.json";

  if (!fs.existsSync("cached")) {
    fs.mkdirSync("cached");
  }

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  fs.writeFileSync(filePath, "[]");
  return [];
}

export function ClearALLNEWCACHEDNewssIds() {
  const filePath = "cached/news-new.json";
  fs.writeFileSync(filePath, "[]");
}

// apend instead of overwriting
export function saveIDNews(links: string[]) {
  const filePath = "cached/news.json";
  const existing = loadCachedNews();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}

export type NewsType = {
  _id: string;
  image: string;
  gridTitle: string;
  TitleLink?: string;
  description: string;
};

export function saveNewLinksNews(links: NewsType[]) {
  const filePath = "cached/news-new.json";
  const existing = loadNewsCachedLinks();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}
