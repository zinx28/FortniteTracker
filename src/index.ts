import dotenv from 'dotenv';
import { FortniteGame, JustGrabLinskFromBP } from './trackers/FortniteGame';
import { GetBlogs, GetComBlogs, GetCreateBlogs } from './trackers/Blogs';
import { ClearALLNEWCACHEDLINMKS, loadNewCachedLinks } from './utils/cachedData';
import { sendBlogembed, sendImageEmbed } from './utils/discordWeb';
import { FortniteStatus } from './trackers/Status';
import { ClearALLNEWCACHEDBlogsIds, loadBlogsCachedLinks } from './utils/blogCache';
import { FortniteCloudStorage } from './trackers/Cloudstorage';
import { FortniteTracker } from './trackers/StagingTracker';
dotenv.config();

async function DiscordWebhookt() 
{
    var AllLinks = loadNewCachedLinks()
    ClearALLNEWCACHEDLINMKS();

    AllLinks.forEach((e) => {
        sendImageEmbed(e);
    })

    var AllBlogs = loadBlogsCachedLinks();
    ClearALLNEWCACHEDBlogsIds();

    AllBlogs.forEach((e) => {
        sendBlogembed(e);
    })

}

async function FetchAllThings() // yes things
{
    FortniteTracker();
    FortniteCloudStorage();
    /*JustGrabLinskFromBP();
    FortniteStatus();
    FortniteGame();
    GetComBlogs();
    GetBlogs();
    GetCreateBlogs();*/
}

await FetchAllThings();
DiscordWebhookt();

setInterval(DiscordWebhookt, 60 * 1000)