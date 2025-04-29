import axios from "axios";
import { extractLinks, getNewLinks } from "../utils/extractLinks";
import { GenerateUserAuth } from "../utils/GenerateAuth";
import { loadCachedLinks, saveLinks, saveNewLinks } from "../utils/cachedData";
import { loadCachedBlogs, type BlogType } from "../utils/blogCache";
import {
  loadCachedNews,
  saveIDNews,
  saveNewLinksNews,
  type NewsType,
} from "../utils/newsCache";

export async function NewsChecker() {
  try {
    const grabauth = await GenerateUserAuth(true);
    console.log(grabauth);

    const tags = [
      "Product.BlastBerry.Habanero",
      "Product.BR.Habanero.Build",
      "Product.BR",
      "Product.Sparks.PilgrimQuickplay",
      "Product.BlastBerry.Build",
      "Product.Figment.Build.Habanero",
      "Product.Figment",
      "Product.Juno",
      "Product.STW",
      "Product.DelMar",
      "Product.FNE.Unknown",
      "Product.Sparks.Jam",
      "Product.BR.Respawn",
      "Product.FNE.Hub",
    ];

    for (const tag of tags) {
      const res = await axios.post(
        "https://prm-dialogue-public-api-prod.edea.live.use1a.on.epicgames.com/api/v1/fortnite-br/channel/motd/target",
        {
          // grabbed from a version with few removed things
          parameters: {
            accountLevel: 2100,
            allowedContentTypes: ["functional", "experience", "marketing"],
            battlepass: false,
            battlepassLevel: 304,
            brPassPurchaseDate: "2025-03-11T11:41:54.492Z",
            bundleschedule_vitalinventor: true,
            character_badcat: false,
            character_bakerstep: false,
            character_buttoncase: false,
            character_chiveflake: false,
            character_combcrater: false,
            character_crumbviolin: false,
            character_fuzzyclaw: true,
            character_inkhoop: false,
            character_kobolobo: true,
            character_mollykit: false,
            character_oatmealspreadactive: false,
            character_oatmealspreadgolem: false,
            character_puzzleshed: false,
            character_sandalsite: false,
            character_twinkleloop: false,
            character_waywardrebelfncs: false,
            completedQuests: [],
            country: "GB",
            figmentPassPurchaseDate: "0001-01-01T00:00:00.000Z",
            filterConsent: false,
            filterLimited: false,
            filterRestricted: false,
            hasAttendedEndOfSeasonS17: false,
            hasSavedEventDate: false,
            junoPassPurchaseDate: "0001-01-01T00:00:00.000Z",
            language: "en",
            levelPerPass: [200, 100, 100, 100],
            ownsSaveTheWorld: true,
            passesOwned: [
              "BattlePass",
              "JunoPass",
              "SparksPass",
              "FigmentPass",
            ],
            platform: "Windows",
            progressiveBackblingStage: 6,
            rating: "PEGI_AGE_12",
            ratingAuthority: "PEGI",
            serverRegion: "EU",
            socialTags: ["Chill", "Mic Off"],
            sparksPassPurchaseDate: "0001-01-01T00:00:00.000Z",
            subscription: true,
            victoryCrownsRoyales: 0,
          },
          tags: [tag],
        },
        {
          headers: {
            // why a user agent, epic games returns a 403 without one
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
            Authorization: `bearer ${grabauth}`,
          },
        }
      );

      if (res.data) {
        const allLinks = extractLinks(JSON.stringify(res.data));
        const cachedLinks = loadCachedLinks();
        const cachedNews = loadCachedNews();

        const newLinks = getNewLinks(cachedLinks, allLinks);
        //console.log(JSON.stringify(res.data));

        // const newIds = getNewID(cachedBlogs, allLinks)
        // console.log(JSON.stringify(res.data));

        if (newLinks.length > 0) {
          console.log(newLinks);
          saveLinks(newLinks);

          if (newLinks.length > 20) return; // if theres no cache file createwd yet then it would basically spam discord

          saveNewLinks(newLinks);
        }

        var NewsList = res.data.contentItems;

        if (NewsList) {
          const IDList: string[] = [];
          const NewIds: NewsType[] = [];

          (NewsList as any[]).forEach((e) => {
            if (!cachedNews.find((e3) => e3 === (e.contentHash as string))) {
              IDList.push(e.contentHash as string);

              const websiteLink =
              e.contentFields.Buttons ? (
                  e.contentFields.Buttons as {
                    Action: { _type: string; websiteUrl?: string };
                  }[]
                )
                  .filter(
                    (button) => button.Action._type === "MotdWebsiteAction"
                  )
                  .map((button) => button.Action.websiteUrl)[0] || null : null;

              NewIds.push({
                _id: e.contentHash as string,
                image: e.contentFields.FullScreenBackground.Image[0]
                  .url as string,
                TitleLink: websiteLink || "",
                gridTitle: e.contentFields.FullScreenTitle as string,
                description: e.contentFields.FullScreenBody,
              });
            }
          });

          saveIDNews(IDList);
          saveNewLinksNews(NewIds);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
