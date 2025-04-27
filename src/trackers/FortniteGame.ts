import axios from "axios";
import { extractLinks, fetchText, getNewLinks } from "../utils/extractLinks";
import { loadCachedLinks, saveLinks, saveNewLinks } from "../utils/cachedData";

export async function FortniteGame() {
  const rawTexxt = await fetchText(
    "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game"
  );
  const allLinks = extractLinks(JSON.stringify(rawTexxt));
  const cachedLinks = loadCachedLinks();
  const newLinks = getNewLinks(cachedLinks, allLinks);
  console.log(newLinks);

  if (newLinks.length > 0) {
    saveLinks(newLinks);

    if (newLinks.length > 10) return; // if theres no cache file then it would basically spam discord

    saveNewLinks(newLinks);
    // discord message???
  }
}

export async function JustGrabLinskFromBP() { // imma disable this for now.... enable if you want but cloudflare will say "hey stop bot" and nothing you can realylk do
  try {
    /*const rawTexxt = await fetchText(
      "https://www.fortnite.com/battle-pass?lang=en-US&_data=routes%2Fbattle-pass._index"
    );
    const allLinks = extractLinks(JSON.stringify(rawTexxt));
    const cachedLinks = loadCachedLinks();
    const newLinks = getNewLinks(cachedLinks, allLinks);
    console.log(newLinks);

    if (newLinks.length > 0) {
      saveLinks(newLinks);

      if (newLinks.length > 10) return; // if theres no cache file then it would basically spam discord

      saveNewLinks(newLinks);
      // discord message???
    }*/
  } catch (err) {
    //console.error(err);
  }
}
