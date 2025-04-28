import axios from "axios";
import fs, { existsSync, readFileSync } from "fs";

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

let cachedUserToken = "";
let cachedUserTokenExpires = 0;

export async function GenerateUserAuth() {
  if (cachedUserToken && Date.now() < cachedUserTokenExpires) {
    return cachedUserToken;
  }

  const filePath = "cached/user.json";
  if (!existsSync(filePath)) return null; // safety or smth idk what to call it

  var UserData = JSON.parse(readFileSync(filePath, "utf8"));

  var response = await axios.post(
    "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
    new URLSearchParams({
      grant_type: 'device_auth',
      account_id: UserData.accountId,
      device_id: UserData.deviceId,
      secret: UserData.secret
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "basic YWY0M2RjNzFkZDkxNDUyMzk2ZmNkZmZiZDdhOGU4YTk6NFlYdlNFQkxGUlBMaDFoekdaQWtmT2k1bXF1cEZvaFo=",
      },
    }
  );

  if (response.data) {
    cachedUserToken = response.data.access_token;
    cachedUserTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // yes the response has time to expire BUT who cares
    console.log(cachedUserToken);
    return cachedUserToken;
  }

  return null;
}

// this is runned one to get token
export async function VerifyGenerateUserAuth() {
  try {
    const filePath = "cached/user.json";
    if (existsSync(filePath)) {
      // verify the data by call other func

      var UserAuth = await GenerateUserAuth();
      if (!UserAuth) return false;

      console.log(UserAuth);

      return true;
    }

    var response = await axios.post(
      "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
      `grant_type=authorization_code&code=${process.env.code}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "basic YWY0M2RjNzFkZDkxNDUyMzk2ZmNkZmZiZDdhOGU4YTk6NFlYdlNFQkxGUlBMaDFoekdaQWtmT2k1bXF1cEZvaFo=",
        },
      }
    );

    if (response.data) {
      console.log(response.data.account_id)
      var responseDeviceAuth = await axios.post(
        `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${response.data.account_id}/deviceAuth`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${response.data.access_token}`,
          },
        }
      );
      if (responseDeviceAuth.data) {
        fs.writeFileSync(filePath, JSON.stringify(responseDeviceAuth.data));
        return true;
      }
    }
  } catch (err) {
    console.error(err);
  }

  return false;
}
