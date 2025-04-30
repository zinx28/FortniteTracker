import fs from "fs";

export function loadCachedLinks(): string[] {
  const filePath = "cached/links.json";

  if (!fs.existsSync("cached")) {
    fs.mkdirSync("cached");
  }

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  fs.writeFileSync(filePath, "[]");
  return [];
}

export function loadNewCachedLinks(): string[] {
  const filePath = "cached/links-new.json";

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

export function ClearALLNEWCACHEDLINMKS() 
{
  const filePath = "cached/links-new.json";
  fs.writeFileSync(filePath, "[]");
}

// apend instead of overwriting
export function saveLinks(links: string[]) {
  const filePath = "cached/links.json";
  const existing = loadCachedLinks();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}

export function saveNewLinks(links: string[]) {
  const filePath = "cached/links-new.json";
  const existing = loadNewCachedLinks();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}
