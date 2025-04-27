import axios from "axios";
import fs from "fs";

let cachedToken = "";
let cachedTokenExpires = 0;

export async function GenerateAuth() {
  if (cachedToken && Date.now() < cachedTokenExpires) {
    return cachedToken;
  }


  var response = await axios.post(
    "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "basic YWY0M2RjNzFkZDkxNDUyMzk2ZmNkZmZiZDdhOGU4YTk6NFlYdlNFQkxGUlBMaDFoekdaQWtmT2k1bXF1cEZvaFo=",
      },
    }
  );

  if (response.data) {
    cachedToken = response.data.access_token;
    cachedTokenExpires = Date.now() + 2 * 60 * 60 * 1000; // yes the response has time to expire BUT who cares
    console.log(cachedToken);
    return cachedToken;
  }

  return response.data;
}
