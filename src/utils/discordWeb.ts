import { WebhookClient, EmbedBuilder } from "discord.js";
import type { BlogType } from "./blogCache";
import type { NewsType } from "./newsCache";
import type { TournamentType } from "./tournamentsCache";

const webhook = new WebhookClient({ url: process.env.URLTracker as string });

export async function sendImageEmbed(imageUrl: string) {
  const embed = new EmbedBuilder()
    .setTitle(imageUrl)
    .setURL(imageUrl)
    .setThumbnail(imageUrl)
    .setColor("Random")
    .setTimestamp();

  await webhook.send({ embeds: [embed] });
}

const webhook2 = new WebhookClient({ url: process.env.BlogTracker as string });

export async function sendBlogembed(body: BlogType) {
  const embed = new EmbedBuilder()
    .setTitle(body.gridTitle)
    .setThumbnail(body.image)
    .setFields([
      {
        name: "Description:",
        value: body.description,
      },
      {
        name: "Link:",
        value: body.urlPattern,
      },
    ])
    .setImage(body.sharedImage)
    .setColor("Random")
    .setTimestamp();

  await webhook2.send({ embeds: [embed] });
}

const webhook3 = new WebhookClient({ url: process.env.NewsTracker as string });

export async function sendNewsembed(body: NewsType) {
  const embed = new EmbedBuilder()
    .setTitle(body.gridTitle)
    .setFields([
      {
        name: "Description:",
        value: body.description,
      },
    ])
    .setImage(body.image)
    .setColor("Random")
    .setTimestamp();

  if (body.TitleLink) embed.setURL(body.TitleLink || "");

  await webhook3.send({ embeds: [embed] });
}

const webhook4 = new WebhookClient({
  url: process.env.TournamentsTracker as string,
});

export async function sendTournamentEmebed(body: TournamentType) {
  function hexToColorInt(hex: string): number {
    hex = hex.trim().replace(/^#/, "").replace(/\s+/g, ""); // epic is weird and has spaces some times
    if (hex.length === 8) hex = hex.slice(0, 6);
    return parseInt(hex, 16);
  }
  const embed = new EmbedBuilder()
    .setTitle(
      body.gridTitle.length > 256
        ? body.gridTitle.slice(0, 253 - 3) + "..."
        : body.gridTitle
    )
    .setDescription(
      body.description.length > 1024
        ? body.description.slice(0, 1021) + "..."
        : body.description
    )
    .setFields([
      {
        name: "Display ID",
        value: body._id,
      },
    ])
    .setImage(body.sharedImage)
    .setThumbnail(body.image)
    .setColor(hexToColorInt(body.embedColor))
    .setTimestamp();

  await webhook4.send({ embeds: [embed] });
}
