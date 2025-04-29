# FortniteTracker

- Tracks, ini, url, blog updates
- yes the code is bad 

### Setup
- remove the ".example" from the .env file, then 'fill it in'
- this application uses bun instead of nodejs
- run start.bat, this will install the needed modules then run after

### User Based Auth (the code expires pretty fast)
- these are used only for a few trackers (e.g. news, keychain)
- go [here](https://www.epicgames.com/id/api/redirect?clientId=af43dc71dd91452396fcdffbd7a8e8a9&responseType=code) to grab the code (use the code from the authorizationCode section) 
- paste it in the env, where it says "code"
- launch the program then the refresh tokens and yap are auto generated so the code isnt reused~ the program will auto detect if the token some how gets invaild (by changing password or epic does a refresh (pretty rare).. smth)