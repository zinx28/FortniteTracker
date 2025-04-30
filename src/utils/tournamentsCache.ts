import fs from "fs";

export function loadCachedTournaments(): string[] {
  // save the id instead
  const filePath = "cached/tournaments.json";

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

export function loadTournamentCachedLinks(): TournamentType[] {
  const filePath = "cached/tournaments-new.json";

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

export function ClearALLNEWCACHEDTournamentIds() {
  const filePath = "cached/tournaments-new.json";
  fs.writeFileSync(filePath, "[]");
}

// apend instead of overwriting
export function saveIDTournament(links: string[]) {
  const filePath = "cached/tournaments.json";
  const existing = loadCachedTournaments();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}

export type TournamentType = {
  _id: string;
  image: string;
  sharedImage: string;
  gridTitle: string;
  description: string; // find to grab, LEWGIT WIERD AS PARSING
  embedColor: string;
};

export function saveNewLinksTournament(links: TournamentType[]) {
  const filePath = "cached/tournaments-new.json";
  const existing = loadTournamentCachedLinks();
  const merged = Array.from(new Set([...existing, ...links]));
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
}
