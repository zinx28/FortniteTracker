// Fortnite status
//http://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=fortnite

import axios from "axios";
import { GenerateAuth } from "../utils/GenerateAuth";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { WebhookClient, EmbedBuilder } from "discord.js";

const webhook = new WebhookClient({ url: process.env.StatusTracker as string });

export async function FortniteStatus() {
  console.log("terst");
  const grabauth = await GenerateAuth();
  console.log(grabauth);

  const res = await axios.get(
    "http://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=fortnite",
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
    if (loadCache() != res.data[0].status) {
      saveCache(res.data[0].status);
      const embed = new EmbedBuilder()
        .setTitle("Fortnite Status")
        //.setThumbnail(imageUrl) ~ could send a image depending on the stauts
        .setFields([
          {
            name: "Status",
            value: res.data[0].status,
            //inline: true
          },
          {
            name: "Message",
            value: res.data[0].message,
          },
        ])
        .setColor("Random")
        .setTimestamp();

      await webhook.send({ embeds: [embed] });
    }
    console.log(res.data[0]);
  }
}

function saveCache(status: string) {
  writeFileSync("cached/status.txt", status);
}

function loadCache() {
  if (existsSync("cached/status.txt")) {
    return readFileSync("cached/status.txt", "utf-8").trim();
  }
  return "DOWN";
}
