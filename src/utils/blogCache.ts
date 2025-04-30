import fs from "fs";

export function loadCachedBlogs(): string[] {
  // save the id instead
  const filePath = "cached/blogs.json";

  if (!fs.existsSync("cached")) {
    fs.mkdirSync("cached");
  }

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  fs.writeFileSync(filePath, "[]");
  return [];
}

/*

{
   "_id": "ID",
   "image": "",
   "gridTitle": "",
   "urlPattern": "/news/fortnite-creators-and-competitors-team-up-in-the-fncs-pro-am-in-los-angeles" // deoebds obn the verjion

}

*/

export function loadBlogsCachedLinks(): BlogType[] {
  const filePath = "cached/blogs-new.json";

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

export function ClearALLNEWCACHEDBlogsIds() {
  const filePath = "cached/blogs-new.json";
  fs.writeFileSync(filePath, "[]");
}

// apend instead of overwriting
export function saveIDBlogs(links: string[]) {
  const filePath = "cached/blogs.json";
  const existing = loadCachedBlogs();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}

export type BlogType = {
  _id: string;
  image: string;
  sharedImage: string;
  gridTitle: string;
  urlPattern: string;
  description: string; // find to grab, LEWGIT WIERD AS PARSING
};

export function saveNewLinksBlogs(links: BlogType[]) {
  const filePath = "cached/blogs-new.json";
  const existing = loadBlogsCachedLinks();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}
