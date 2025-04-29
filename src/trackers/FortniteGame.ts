import axios from "axios";
import { extractLinks, fetchText, getNewLinks } from "../utils/extractLinks";
import { loadCachedLinks, saveLinks, saveNewLinks } from "../utils/cachedData";
import { WebhookClient } from "discord.js";
import {
  loadCachedTournaments,
  saveIDTournament,
  saveNewLinksTournament,
  type TournamentType,
} from "../utils/tournamentsCache";

export async function FortniteGame() {
  try {
    const rawTexxt = await fetchText(
      "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game"
    );
    const allLinks = extractLinks(JSON.stringify(rawTexxt));
    const cachedLinks = loadCachedLinks();
    const cachedTournaments = loadCachedTournaments();
    const newLinks = getNewLinks(cachedLinks, allLinks);
    console.log(newLinks);

    if (newLinks.length > 0) {
      saveLinks(newLinks);

      if (newLinks.length > 10) return; // if theres no cache file then it would basically spam discord

      saveNewLinks(newLinks);
      // discord message???
    }

    var Tournaments =
      rawTexxt.tournamentinformation.tournament_info.tournaments;

    if (Tournaments) {
      const IDList: string[] = [];
      const NewIds: TournamentType[] = [];

      (Tournaments as any[]).forEach((e) => {
        if (
          !cachedTournaments.find(
            (e3) => e3 === (e.tournament_display_id as string)
          )
        ) {
          IDList.push(e.tournament_display_id as string);

          NewIds.push({
            _id: e.tournament_display_id as string,
            image: e.square_poster_image as string,
            sharedImage: e.playlist_tile_image as string,
            gridTitle: e.long_format_title as string,
            description: e.details_description as string,
            embedColor: e.background_right_color as string,
          });
        }
      });

      saveIDTournament(IDList);
      saveNewLinksTournament(NewIds);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function JustGrabLinskFromBP() {
  // imma disable this for now.... enable if you want but cloudflare will say "hey stop bot" and nothing you can realylk do~
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
