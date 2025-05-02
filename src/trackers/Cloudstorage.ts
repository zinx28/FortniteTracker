//https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/cloudstorage/system

// Fortnite status
//http://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=fortnite

import axios from "axios";
import { GenerateAuth } from "../utils/GenerateAuth";
import { existsSync, readFileSync, writeFileSync } from "fs";
import {
  WebhookClient,
  EmbedBuilder,
  AttachmentBuilder,
  type EmbedField,
} from "discord.js";
import path from "path";
var modifications: Record<string, Record<string, string>> = {};
type TextChanges = {
  // stirng is the key
  OLDString: string;
  NativateString: string;
  NewString: string;
};
var textChanges: Record<string, TextChanges> = {}; // ONLY CHANGES

var modificationsDataTable: Record<string, Record<string, string>> = {};
export async function diffFile(
  cachedPath: string,
  newContent: string
): Promise<string> {
  modifications = {};
  modificationsDataTable = {};
  textChanges = {};

  let cachedContent = "";
  if (existsSync(cachedPath)) {
    cachedContent = readFileSync(cachedPath, "utf8");
  }

  const extractSections = (content: string): Record<string, string[]> => {
    const sections: Record<string, string[]> = {};
    let currentSection = "";
    let currentContent: string[] = [];

    content.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
        if (currentSection) {
          sections[currentSection] = currentContent;
        }
        currentSection = trimmedLine;
        currentContent = [];
      } else if (currentSection && trimmedLine) {
        currentContent.push(trimmedLine);
      }
    });

    if (currentSection) {
      sections[currentSection] = currentContent;
    }

    return sections;
  };

  const cachedSections = extractSections(cachedContent);
  const newSections = extractSections(newContent);

  let diffResult = "";

  Object.keys(newSections).forEach((section) => {
    const cachedSectionContent = cachedSections[section] || [];
    const newSectionContent = newSections[section];

    const addedLines = newSectionContent.filter(
      (line) => !cachedSectionContent.includes(line)
    );
    const removedLines = cachedSectionContent.filter(
      (line) => !newSectionContent.includes(line)
    );

    if (addedLines.length > 0 || removedLines.length > 0) {
      diffResult += `\n${section}\n`;

      //addedLines.forEach((line) => {
      // diffResult += `+ ${line}\n`;
      //});

      addedLines.forEach((line) => {
        diffResult += `+ ${line}\n`;

        // Smart Sumarysd
        var match = line.match(
          /^\+\s*CurveTable=([^;]+);([^;]+);([^;]+);([^;]+);([^;]+)$/
        );

        if (match) {
          //console.log("Line:", line, "Match:", match);
          /*
            [
  "+CurveTable=/SproutItems_Currency/DataTables/SproutItems_CurrencyGameData;RowUpdate;Default.Currency.Limit;2.0;300000.0",
  "/SproutItems_Currency/DataTables/SproutItems_CurrencyGameData",
  "RowUpdate", "Default.Currency.Limit", "2.0",
  "300000.0", index: 0, input: "+CurveTable=/SproutItems_Currency/DataTables/SproutItems_CurrencyGameData;RowUpdate;Default.Currency.Limit;2.0;300000.0",
  groups: undefined
]
  */
          const dataTable = match[1];
          const prop1 = match[2];
          const prop2 = match[3];
          const prop3 = match[4];
          const value = match[5];

          if (!modifications[dataTable]) {
            modifications[dataTable] = {};
          }

          modifications[dataTable][prop2] = value;
        } else {
          match = line.match(
            /^\+\s*DataTable=([^;]+);([^;]+);([^;]+);([^;]+);([^;]+)$/
          );

          if (match) {
            //console.log("Line:", line, "Match:", match);

            const dataTable = match[1];
            const rowUpdate = match[2];
            const prop1 = match[3];
            const prop2 = match[4];
            const newValue = match[5];

            if (!modificationsDataTable[dataTable]) {
              modificationsDataTable[dataTable] = {};
            }

            modificationsDataTable[dataTable][prop2] = newValue;
          } else {
            match = line.match(
              /^\+TextReplacements=\(\s*Category=([^,]+),\s*Namespace="([^"]*)",\s*(?:bIsMinimalPatch=[^,]+,\s*)?Key="([^"]+)",\s*NativeString="([^"]+)",\s*LocalizedStrings=\((.*)\)\)$/
            );
            

            if (match) {
              console.log(match);
              const key = match[3];
              const locale = match[2];
              const nativeString = match[4];
              const localizedString = match[5];
              const enMatch = localizedString.match(/\("en","([^"]+)"\)/);

              console.log("frfr");

              if (!textChanges[key]) {
                textChanges[key] = {
                  OLDString: "",
                  NativateString: "",
                  NewString: "",
                };
              }

              if (enMatch) {
                const englishText = enMatch[1];
                console.log(englishText);

                var StringFr = "";
                if (nativeString != englishText) {
                  StringFr = nativeString;
                } else StringFr = "";

                textChanges[key] = {
                  NewString: englishText,
                  NativateString: StringFr,
                  OLDString: "",
                };
              } else {
                // this doesnt have a english string so we just delete this part
                delete textChanges[key];
              }
            }
          }
        }
      });

      removedLines.forEach((line) => {
        diffResult += `- ${line}\n`;

        const match = line.match(
          /^\+TextReplacements=\(Category=([^,]+), Namespace="([^"]*)", bIsMinimalPatch=[^,]+, Key="([^"]+)", NativeString="([^"]+)", LocalizedStrings=\((.*)\)\)$/
        );

        if (match) {
          const key = match[3];

          if (textChanges[key]) {
            const localizedString = match[5];
            const enMatch = localizedString.match(/\("en","([^"]+)"\)/);

            console.log("frfr2");
            if (enMatch) {
              const englishText = enMatch[1];
              console.log(englishText);

              console.log(textChanges[key]);

              if (textChanges[key].NewString != englishText) {
                textChanges[key].OLDString = englishText;
                console.log("detected a change");
              } else {
                delete textChanges[key];
              }
            }
          }

          //console.log("hi");
          // console.log(textChanges);
        }
      });
    }
  });

  Object.keys(cachedSections).forEach((section) => {
    if (!newSections[section]) {
      diffResult += `\n${section}\n`;
      cachedSections[section].forEach((line) => {
        diffResult += `- ${line}\n`;
      });
    }
  });

  return diffResult.trim();
}

const webhook = new WebhookClient({ url: process.env.IniTracker as string });

type CloudStorageFiles = {
  uniqueFilename: string;
  filename: string;
  hash: string;
  hash256: string;
  length: 1063;
  contentType: string;
  uploaded: string;
  storageType: string;
  storageIds: {
    DSS: string;
  };
  doNotCache: boolean;
};

export async function FortniteCloudStorage() {
  try {
    console.log("HUY");
    const grabauth = await GenerateAuth();
    console.log(grabauth);

    const res = await axios.get(
      "https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/cloudstorage/system",
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
      if (Array.isArray(res.data)) {
        const cachedData = loadCache();
        if (cachedData.length > 0) {
          res.data.forEach(async (newData) => {
            const cachedItem = cachedData.find(
              (item) => item.uniqueFilename === newData.uniqueFilename
            );

            if (cachedItem) {
              if (!cachedItem.filename.includes(".json"))
                if (cachedItem.uploaded != newData.uploaded) {
                  console.log("YE~ " + JSON.stringify(cachedItem));

                  // const cachedPath = path.join("cached", cachedItem.uniqueFilename);
                  const res = await axios.get(
                    `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/cloudstorage/system/${cachedItem.uniqueFilename}`,
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
                    var DataChanged = await diffFile(
                      path.join("cached", cachedItem.uniqueFilename),
                      res.data
                    );

                    if (DataChanged) {
                      var EmbedMessages: EmbedBuilder[] = [];

                      if (Object.keys(modifications).length > 0) {
                        const embed = new EmbedBuilder()
                          .setColor("Random")
                          .setTitle("CurveTable modification detected")
                          .setTimestamp();
                        let arrayTest: EmbedField[] = [];

                        Object.keys(modifications).forEach((dataTable) => {
                          embed.setDescription("Changed data: " + dataTable);
                          const data = modifications[dataTable];

                          Object.keys(data).forEach((property) => {
                            arrayTest.push({
                              name: property,
                              value: data[property],
                              inline: false,
                            });
                          });
                        });

                        if (arrayTest.length > 0)
                          for (let i = 0; i < arrayTest.length; i += 10) {
                            const chunk = arrayTest.slice(i, i + 10);
                            embed.setFields(chunk);
                            EmbedMessages.push(embed);
                          }
                      }

                      if (Object.keys(modificationsDataTable).length > 0) {
                        const embed2 = new EmbedBuilder()
                          .setColor("Random")
                          .setTitle("DataTable modification detected")
                          .setTimestamp();
                        let arrayTest: EmbedField[] = [];

                        Object.keys(modificationsDataTable).forEach(
                          (dataTable) => {
                            embed2.setDescription("Changed data: " + dataTable);
                            const data = modificationsDataTable[dataTable];

                            Object.keys(data).forEach((property) => {
                              arrayTest.push({
                                name: property,
                                value: data[property],
                                inline: false,
                              });
                            });
                          }
                        );

                        if (arrayTest.length > 0)
                          for (let i = 0; i < arrayTest.length; i += 10) {
                            const chunk = arrayTest.slice(i, i + 10);
                            embed2.setFields(chunk);
                            EmbedMessages.push(embed2);
                          }
                      }

                      if (Object.keys(textChanges).length > 0) {
                        const embed2 = new EmbedBuilder()
                          .setColor("Random")
                          .setTitle("String modification detected")
                          .setTimestamp();
                        let arrayTest: EmbedField[] = [];

                        Object.keys(textChanges).forEach((KEY) => {
                          const data = textChanges[KEY];
                          if (data.OLDString.trim() === "")
                            data.OLDString = data.NativateString;

                          var FRFR = `~~${data.OLDString}~~ \n${data.NewString}`;

                          console.log(FRFR);

                          arrayTest.push({
                            name: KEY,
                            value: FRFR,
                            inline: false,
                          });
                        });

                        if (arrayTest.length > 0)
                          for (let i = 0; i < arrayTest.length; i += 10) {
               
                            const chunk = arrayTest.slice(i, i + 10);
                            embed2.setFields(chunk);
                            EmbedMessages.push(embed2);
                          }
                      }

                      if (DataChanged.length > 1900) {
                        const buffer = Buffer.from(DataChanged, "utf8");
                        const attachment = new AttachmentBuilder(buffer, {
                          name: `${cachedItem.filename}.diff`,
                        });

                        if (EmbedMessages.length > 0)
                          for (let i = 0; i < EmbedMessages.length; i += 10) {
                            const chunk = EmbedMessages.slice(i, i + 10);
                            await webhook.send({
                              content: `${cachedItem.filename} has been updated!`,
                              files: i === 0 ? [attachment] : [],
                              embeds: chunk,
                            });
                          }
                      } else {
                        if (DataChanged.trim() !== "") {
                          if (EmbedMessages.length > 0)
                            for (let i = 0; i < EmbedMessages.length; i += 10) {
                              const chunk = EmbedMessages.slice(i, i + 10);
                              await webhook.send({
                                content: `${cachedItem.filename} has been updated! \n\`\`\`diff\n${DataChanged}\n\`\`\``,
                                embeds: chunk,
                              });
                            }
                        }
                      }

                      writeFileSync(
                        path.join("cached", cachedItem.uniqueFilename),
                        res.data
                      );
                    }
                  }
                }
            } else {
              // cant find the file? create it
              const cachedPath = path.join("cached", newData.uniqueFilename);
              const res = await axios.get(
                `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/cloudstorage/system/${newData.uniqueFilename}`,
                {
                  headers: {
                    // why a user agent, epic games returns a 403 without one
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
                    Authorization: `bearer ${grabauth}`,
                  },
                }
              );

              if (res.data) writeFileSync(cachedPath, res.data);

              // todo send to discord
            }

            //if (cachedItem.uploaded !== newData.uploaded) {
            //   filesn;
            //}

            //if (!cachedItem || cachedItem.uploaded !== newData.uploaded) {
            //  cachedData.push(newData);
            // }
          });
        } else {
          res.data.forEach(async (newData) => {
            const cachedPath = path.join("cached", newData.uniqueFilename);
            const res = await axios.get(
              `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/cloudstorage/system/${newData.uniqueFilename}`,
              {
                headers: {
                  // why a user agent, epic games returns a 403 without one
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
                  Authorization: `bearer ${grabauth}`,
                },
              }
            );

            if (res.data) writeFileSync(cachedPath, res.data);
          });
        }

        saveCache(JSON.stringify(res.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function saveCache(status: string) {
  writeFileSync("cached/cloudstoragearray.json", status);
}

function loadCache(): CloudStorageFiles[] {
  if (existsSync("cached/cloudstoragearray.json")) {
    return JSON.parse(
      readFileSync("cached/cloudstoragearray.json", "utf-8").trim()
    );
  }
  return [];
}
