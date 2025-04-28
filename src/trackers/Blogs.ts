import { extractLinks, fetchText, getNewLinks } from "../utils/extractLinks";
import { loadCachedLinks, saveLinks, saveNewLinks } from "../utils/cachedData";
import {
  loadCachedBlogs,
  saveIDBlogs,
  saveNewLinksBlogs,
  type BlogType,
} from "../utils/blogCache";

export async function GetBlogs() {
  try {
    const rawTexxt = await fetchText(
      "https://www.fortnite.com/api/blog/getPosts?offset=0&category=&rootPageSlug=blog&postsPerPage=10&locale=eu"
    );
    const allLinks = extractLinks(JSON.stringify(rawTexxt));
    const cachedLinks = loadCachedLinks();
    const cachedBlogs = loadCachedBlogs();
    const newLinks = getNewLinks(cachedLinks, allLinks);
    // const newIds = getNewID(cachedBlogs, allLinks)
    console.log(newLinks);

    if (newLinks.length > 0) {
      saveLinks(newLinks);

      if (newLinks.length > 10) return; // if theres no cache file createwd yet then it would basically spam discord

      saveNewLinks(newLinks);
    }

    var BlogsList = rawTexxt.blogList;

      if (BlogsList) {
        const IDList: string[] = [];
        const NewIds: BlogType[] = [];

        (BlogsList as any[]).forEach((e) => {
          IDList.push(e._id as string);
          if (!cachedBlogs.find((e3) => e3 === (e._id as string))) {
            const descriptionMatch = e._metaTags
              ? e._metaTags.match(
                  /<meta\s+name="description"\s+content="(.*?)">/
                )[1]
              : "";
            NewIds.push({
              _id: e._id as string,
              image: e.image as string,
              gridTitle: e.title as string,
              urlPattern: `https://www.fortnite.com/news/${e.slug}`,
              description: descriptionMatch[1],
            });
          }
        });

        saveIDBlogs(IDList);
        saveNewLinksBlogs(NewIds);
      }
  } catch (err) {
    console.error(err);
  }
}

export async function GetComBlogs() {
  console.log("test");
  const rawTexxt = await fetchText(
    "https://www.fortnite.com/competitive/api/blog/getPosts?offset=0&category=&rootPageSlug=news&postsPerPage=10&locale=eu"
  );
  const allLinks = extractLinks(JSON.stringify(rawTexxt));
  const cachedLinks = loadCachedLinks();
  const cachedBlogs = loadCachedBlogs();
  const newLinks = getNewLinks(cachedLinks, allLinks);
  console.log(newLinks);

  if (newLinks.length > 0) {
    saveLinks(newLinks);

    if (newLinks.length > 10) return; // if theres no cache file then it would basically spam discord

    saveNewLinks(newLinks);
  }

  var BlogsList = rawTexxt.blogList;

  if (BlogsList) {
    const IDList: string[] = [];
    const NewIds: BlogType[] = [];

    (BlogsList as any[]).forEach((e) => {
      IDList.push(e._id as string);
      if (!cachedBlogs.find((e3) => e3 === (e._id as string))) {
        const descriptionMatch = e._metaTags
          ? e._metaTags.match(
              /<meta\s+name="description"\s+content="(.*?)">/
            )[1]
          : "";
        NewIds.push({
          _id: e._id as string,
          image: e.image as string,
          gridTitle: e.title as string,
          urlPattern: `https://www.fortnite.com/competitive/news/${e.slug}`,
          description: descriptionMatch,
        });
      }
    });

    console.log(NewIds);
    saveIDBlogs(IDList);
    saveNewLinksBlogs(NewIds);
  }
}

//        return "/api/cms/v1/articles?postsPerPage=".concat(t, "&offset=").concat(i, "&locale=").concat(e, "&rootPageSlug=blog-creator-portal")
// Create Fortnite API (nextjs~)

//https://create.fortnite.com/api/cms/v1/articles?postsPerPage=10&rootPageSlug=blog-creator-portal

export async function GetCreateBlogs() {
  console.log("test");
  const rawTexxt = await fetchText(
    "https://create.fortnite.com/api/cms/v1/articles?postsPerPage=10&rootPageSlug=blog-creator-portal&locale=eu"
  );
  const allLinks = extractLinks(JSON.stringify(rawTexxt));
  const cachedLinks = loadCachedLinks();
  const cachedBlogs = loadCachedBlogs();
  const newLinks = getNewLinks(cachedLinks, allLinks);
  console.log(newLinks);

  if (newLinks.length > 0) {
    saveLinks(newLinks);

    if (newLinks.length > 10) return; // if theres no cache file then it would basically spam discord

    saveNewLinks(newLinks);
  }

  var BlogsList = rawTexxt.blogList;

  if (BlogsList) {
    const IDList: string[] = [];
    const NewIds: BlogType[] = [];

    (BlogsList as any[]).forEach((e) => {
      IDList.push(e._id as string);
      if (!cachedBlogs.find((e3) => e3 === (e._id as string))) {
        const descriptionMatch = e._metaTags
          ? e._metaTags.match(
              /<meta\s+name="description"\s+content="(.*?)">/
            )[1]
          : "";
        NewIds.push({
          _id: e._id as string,
          image: e.image as string,
          gridTitle: e.title as string,
          urlPattern: `https://create.fortnite.com/news/${e.slug}`,
          description: descriptionMatch,
        });
      }
    });

    saveIDBlogs(IDList);
    saveNewLinksBlogs(NewIds);
  }
}
