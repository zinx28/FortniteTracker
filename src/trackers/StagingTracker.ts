import axios from "axios";
import { GenerateAuth } from "../utils/GenerateAuth";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { EmbedBuilder, WebhookClient } from "discord.js";

type GameVersionData = {
  app: string;
  cln: string;
  build: string;
  moduleName: string;
  buildDate: string;
  version: string;
  branch: string;
};

const webhook = new WebhookClient({
  url: process.env.StagingTracker as string,
});

export async function FortniteTracker() {
  console.log("terst");
  const grabauth = await GenerateAuth();

  let GameVersionProds = [
    {
        Name: "Prod",
        URL: "https://fortnite-public-service-prod.ak.epicgames.com/fortnite/api/version"
    },
   // { removed...
    //    Name: "PlayTest",
    //    URL: "https://fortnite-public-service-devplaytest-prod12.ol.epicgames.com/fortnite/api/version"
    //},
    //{ same as prod
    //    Name: "Prod11",
    //    URL: "https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/version"
    //},
    {
        Name: "ReleasePlayTest-Prod",
        URL: "https://fortnite-public-service-releaseplaytest-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "LiveBroadcasting-Prod",
        URL: "https://fortnite-public-service-livebroadcasting-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "PartnerStable-Prod",
        URL: "https://fortnite-public-service-partnersstable-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "Partners-Prod",
        URL: "https://fortnite-public-service-partners-prod.ol.epicgames.com/fortnite/api/version"  
    },
    {
        Name: "PartnerStable-Prod",
        URL: "https://fortnite-public-service-partnersstable-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "DevPlayTestJ-Prod",
        URL: "https://fortnite-public-service-devplaytestj-prod.ol.epicgames.com/fortnite/api/version" // fngw-mcp-gc-devplaytestj-prod.ol.epicgames.com, 
    },
    {
        Name: "BacchusPlayTest-Prod",
        URL: "https://fortnite-public-service-bacchusplaytest-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "LoadTest-Prod",
        URL: "https://fngw-mcp-ds-loadtest-prod.ol.epicgames.com/fortnite/api/version"
    },
    {
        Name: "PublicTest-Prod",
        URL: "https://fngw-mcp-gc-publictest-prod.ol.epicgames.com/fortnite/api/version" // useless from the cln and build ~ fortnite-public-service-publictest-prod.ol.epicgames.com ~ fortnite-public-service-extqauetestingb-prod.ol.epicgames.com
    }, // ^^ i dont want to have it updating  being useless
    {
        Name: "Floss-Prod",
        URL: "https://fortnite-public-service-floss-prod.ol.epicgames.com/fortnite/api/version" 
    },
    {
        Name: "Floss-Prod",
        URL: "https://fortnite-public-service-floss-prod.ol.epicgames.com/fortnite/api/version"  // pretty useless i need to test run this
    },
    {
        Name: "Floss-Prod",
        URL: "https://fortnite-public-service-floss-prod.ol.epicgames.com/fortnite/api/version" 
    },
  ];
  //devplaytestj
  GameVersionProds.forEach(async (e) => {
    const res = await axios.get(e.URL, {
      headers: {
        // why a user agent, epic games returns a 403 without one
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        Authorization: `bearer ${grabauth}`,
      },
    });

    if (res.data) {
      const currentData = res.data as GameVersionData;
      if (existsSync(`cached/${e.Name}`)) {
        var FrfrFile = JSON.parse(
          readFileSync(`cached/${e.Name}`, "utf-8")
        );

        console.log(FrfrFile.cln);

        if (FrfrFile) {
          const embed = new EmbedBuilder()
            .setTitle(`Modification Detected: ${e.Name}`)
            .setDescription(`ModuleName: ${currentData.moduleName}`)
            .setColor("Random")
            .setTimestamp();

          const changes: {
            field: string;
            oldValue: string;
            newValue: string;
          }[] = [];

          const fieldsToCheck = [
            "cln",
            "build",
            "buildDate",
            "version",
            "branch",
          ];

          fieldsToCheck.forEach((field) => {
            const oldValue = (FrfrFile as any)[field];
            const newValue = (currentData as any)[field];

            if (oldValue !== newValue) {
              changes.push({
                field,
                oldValue,
                newValue,
              });
            }
          });

          if (changes.length > 0) {
            changes.forEach((change) => {
              embed.addFields([
                {
                  name: change.field,
                  value: `~~${change.oldValue}~~\n${change.newValue}`,
                  inline: true
                },
              ]);
            });

            webhook.send({ embeds: [embed] });
          }
        }
      }

      writeFileSync(
        path.join("cached", e.Name),
        JSON.stringify(res.data)
      );
    }
  });
}
