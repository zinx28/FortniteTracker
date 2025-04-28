import axios from "axios";

/*
    Returns links only
*/
export function extractLinks(text: string): string[] {
  const regex = /https?:\/\/[^\s"']+/g;
  return [...new Set(text.match(regex) || [])];
}

/* 
  Return text from url
*/
export async function fetchText(url: string) {
  try {
    const res = await axios.get(url, {
      headers: {
        // why a user agent, epic games returns a 403 without one
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
} // i dout it returns a string. skul

export function getNewLinks(oldLinks: string[], currentLinks: string[]) {
  const oldSet = new Set(oldLinks);
  return currentLinks
    .filter((link) => !oldSet.has(link))
    .filter((link) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(link));
}

export function getNewItem(olditems: string[], currentItems: string[]) {
  const oldSet = new Set(olditems);
  return currentItems.filter((word) => !oldSet.has(word));
}

