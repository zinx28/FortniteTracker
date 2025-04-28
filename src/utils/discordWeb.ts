import { WebhookClient, EmbedBuilder } from 'discord.js'
import type { BlogType } from './blogCache'
import type { NewsType } from './newsCache'

const webhook = new WebhookClient({ url: process.env.URLTracker as string })

export async function sendImageEmbed(imageUrl: string) {
  const embed = new EmbedBuilder()
    .setTitle(imageUrl)
    .setURL(imageUrl)
    .setThumbnail(imageUrl)
    .setColor('Random')
    .setTimestamp()

  await webhook.send({ embeds: [embed] })
}

const webhook2 = new WebhookClient({ url: process.env.BlogTracker as string })

export async function sendBlogembed(body: BlogType) {
  const embed = new EmbedBuilder()
    .setTitle(body.gridTitle)
    .setFields([
      {
        name: "Description:",
        value: body.description
      },
      {
        name: "Link:",
        value: body.urlPattern
      }
    ])
    .setImage(body.image)
    .setColor('Random')
    .setTimestamp()

  await webhook2.send({ embeds: [embed] })
}

const webhook3 = new WebhookClient({ url: process.env.NewsTracker as string })

export async function sendNewsembed(body: NewsType) {
  const embed = new EmbedBuilder()
    .setTitle(body.gridTitle)
    .setFields([
      {
        name: "Description:",
        value: body.description
      }
    ])
    .setImage(body.image)
    .setColor('Random')
    .setTimestamp()

    if(body.TitleLink)
      embed.setURL(body.TitleLink || "")

  await webhook3.send({ embeds: [embed] })
}