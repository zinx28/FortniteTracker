import axios from "axios";
import { GenerateUserAuth } from "../utils/GenerateAuth";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getNewItem } from "../utils/extractLinks";

const webhook = new WebhookClient({
  url: process.env.AesTracker as string,
});

// we can use this for the aes key..
export async function KeyChain() {
  console.log("terst");
  const grabauth = await GenerateUserAuth();
  console.log(grabauth);

  const res = await axios.get(
    "https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/storefront/v2/keychain",
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
    var CachedData = loadCache();
    var NewItems = getNewItem(CachedData, res.data);
    if (NewItems.length > 0 && NewItems.length < 10) {
      type ItemRecord = {
        AES: string;
        ItemIds: string[];
      };

      const records: Record<string, ItemRecord> = {};

      NewItems.forEach((e) => {
        const parts = e.split(":");
        const guid = parts[0] || "";
        const aes = parts[1] || "";
        var itemId = parts[2] || "";

        if (!guid || !aes) return;

        if (!itemId) itemId = "unknown...";

        if (!records[guid]) {
          records[guid] = {
            AES: `0x${Buffer.from(aes, "base64")
              .toString("hex")
              .toUpperCase()} `,
            ItemIds: [],
          };
        }

        if (!records[guid].ItemIds.includes(itemId)) {
          records[guid].ItemIds.push(itemId);
        }
      });

      console.log(records);

      Object.keys(records).forEach(async (KEY) => {
        const fields = [
          {
            name: "AES",
            value: `\`\`\`\n${records[KEY].AES}\n\`\`\``,
            inline: false,
          },
          {
            name: "GUID",
            value: `\`\`\`\n${KEY}\n\`\`\``,
            inline: false,
          },
          {
            name: "Item ID",
            value: records[KEY].ItemIds.map(
              (id) => `\`\`\`\n${id}\n\`\`\``
            ).join(""),
            inline: false,
          },
        ];
        const embed = new EmbedBuilder()
          //.setTitle("New")
          .setFields(fields)
          .setColor("Random")
          .setTimestamp();

        await webhook.send({ embeds: [embed] });
      });
    }
    saveCache(res.data);
    //console.log(res.data[0]);
  }
}

function saveCache(keychainitems: string[]) {
  writeFileSync("cached/keychain.json", JSON.stringify(keychainitems, null, 2));
}

function loadCache() {
  if (existsSync("cached/keychain.json")) {
    return JSON.parse(readFileSync("cached/keychain.json", "utf-8"));
  }
  return [];
}
