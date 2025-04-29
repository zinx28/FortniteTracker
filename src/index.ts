import dotenv from "dotenv";
import { FortniteGame, JustGrabLinskFromBP } from "./trackers/FortniteGame";
import { GetBlogs, GetComBlogs, GetCreateBlogs } from "./trackers/Blogs";
import {
  ClearALLNEWCACHEDLINMKS,
  loadNewCachedLinks,
} from "./utils/cachedData";
import { sendBlogembed, sendImageEmbed, sendNewsembed } from "./utils/discordWeb";
import { FortniteStatus } from "./trackers/Status";
import {
  ClearALLNEWCACHEDBlogsIds,
  loadBlogsCachedLinks,
} from "./utils/blogCache";
import { FortniteCloudStorage } from "./trackers/Cloudstorage";
import { FortniteTracker } from "./trackers/StagingTracker";
import { KeyChain } from "./trackers/Keychain";
import { VerifyGenerateUserAuth } from "./utils/GenerateAuth";
import { NewsChecker } from "./trackers/NewsChecks";
import { ClearALLNEWCACHEDNewssIds, loadNewsCachedLinks } from "./utils/newsCache";
import { TimelineTracker } from "./trackers/Flags";
dotenv.config();
var ShouldGenerate = false;

if (process.env.code?.trim() === "")
  console.error("Code is empty, few trackers are disabled");
else if (await VerifyGenerateUserAuth()) ShouldGenerate = true;

async function DiscordWebhookt() {
  var AllLinks = loadNewCachedLinks();
  ClearALLNEWCACHEDLINMKS();

  AllLinks.forEach((e) => {
    sendImageEmbed(e);
  });

  var AllBlogs = loadBlogsCachedLinks();
  ClearALLNEWCACHEDBlogsIds();

  AllBlogs.forEach((e) => {
    sendBlogembed(e);
  });

  var AllNews = loadNewsCachedLinks();
  ClearALLNEWCACHEDNewssIds();

  AllNews.forEach((e) => {
    sendNewsembed(e);
  });
}

async function FetchAllThings() {
  // yes things
  // These require a real user auth....
  // due to it not hjaving storefront read and more i cant be bothered, needs to be a realk user
  if (ShouldGenerate) {
    // depends if token is even vaild
    TimelineTracker();
    KeyChain();
    NewsChecker();
  } else console.log("Disabled due to invaild auth!");

  // under some use auth and some not but not user based

  FortniteTracker();
  FortniteCloudStorage();
  JustGrabLinskFromBP();
  FortniteStatus(); //~ doesnt need a auth but not removing
  FortniteGame();
  GetComBlogs();
  GetBlogs();
  GetCreateBlogs();
}

await FetchAllThings();
DiscordWebhookt();

setInterval(FetchAllThings, 60 * 1000);
setInterval(DiscordWebhookt, 70 * 1000);
