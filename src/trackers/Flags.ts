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
import { existsSync, readFileSync, writeFileSync } from "fs";
import { diffEvents, findAllActiveEvents } from "../utils/Flags/ActiveEvents";
import { Colors, EmbedBuilder, WebhookClient } from "discord.js";

const webhook = new WebhookClient({ url: process.env.FlagsTracker as string });

export async function TimelineTracker() {
  try {
    const grabauth = await GenerateUserAuth(true);
    console.log(grabauth);

    const res = await axios.get(
      "https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/calendar/v1/timeline",
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
      var TimelineOld = loadCache();
      var FindAllActiveEvents = await findAllActiveEvents(res.data).flat();
      //console.log(JSON.stringify(res.data));
      if (TimelineOld) {
        const { added, removed, modified } = diffEvents(
          TimelineOld,
          FindAllActiveEvents
        );

        const Embed: EmbedBuilder[] = [];

        function toDiscordTimestamp(isoDate: string): string {
          const unix = Math.floor(new Date(isoDate).getTime() / 1000);
          return `<t:${unix}:f>`;
        }

        added.forEach((element) => {
          const embed2 = new EmbedBuilder()
            .setColor(Colors.Green)
            .addFields([
              {
                name: "EventType",
                value: `${element.eventType}`,
              },
              {
                name: "Starts",
                value: `${toDiscordTimestamp(element.activeSince)}`,
              },
              {
                name: "Ends",
                value: `${toDiscordTimestamp(element.activeUntil)}`,
              },
              {
                name: "Status",
                value: "Added",
              },
            ])
            .setTimestamp();

          Embed.push(embed2);
        });

        removed.forEach((element) => {
          const embed2 = new EmbedBuilder()
            .setColor(Colors.Red)
            .addFields([
              {
                name: "EventType",
                value: `${element.eventType}`,
              },
              {
                name: "Starts",
                value: `${toDiscordTimestamp(element.activeSince)}`,
              },
              {
                name: "Ends",
                value: `${toDiscordTimestamp(element.activeUntil)}`,
              },
              {
                name: "Status",
                value: "Removed",
              },
            ])
            .setTimestamp();

          Embed.push(embed2);
        });

        modified.forEach((element) => {
          const embed2 = new EmbedBuilder()
            .setColor(Colors.Blue)
            .addFields([
              {
                name: "EventType",
                value: `${element.eventType}`,
              },
              {
                name: "Start Date",
                value:
                  element.oldActiveSince &&
                  element.oldActiveSince !== element.newActiveSince
                    ? `~~${toDiscordTimestamp(
                        element.oldActiveSince
                      )}~~ ➜ ${toDiscordTimestamp(element.newActiveSince)}`
                    : `${toDiscordTimestamp(element.newActiveSince)}`,
              },
              {
                name: "End Date",
                value: element.oldActiveUntil
                  ? `~~${toDiscordTimestamp(
                      element.oldActiveUntil
                    )}~~ ➜ ${toDiscordTimestamp(element.newActiveUntil)}`
                  : `${toDiscordTimestamp(element.newActiveUntil)}`,
              },
              {
                name: "Status",
                value: "Modified",
              },
            ])
            .setTimestamp();

          Embed.push(embed2);
        });

        if (Embed.length > 0) await webhook.send({ embeds: Embed });
        //console.log(await findAllActiveEvents(res.data));
      }
      saveCache(FindAllActiveEvents);
    }
  } catch (err) {
    console.error(err);
  }
}

function saveCache(TimelineResponse: object) {
  writeFileSync(
    "cached/timeline.json",
    JSON.stringify(TimelineResponse, null, 2)
  );
}

function loadCache() {
  if (existsSync("cached/timeline.json")) {
    return JSON.parse(readFileSync("cached/timeline.json", "utf-8"));
  }
  return {};
}
