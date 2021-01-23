# Minimalist Discord Invite Role Bot
This is a very minimal discord bot that allows you to associate invites with specific roles so that when that invite is used, the role is automatically added.

## Install
```
git clone https://github.com/okwme/discord-invite-role-bot
cd discord-invite-role-bot
npm i
```

## Config
There's a file called `config.json.example`. Rename it `config.json` and add your discord Bot Token. To learn how to do this follow [these instructions](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js).

## Running
This is a singel file node app so it can be run like:
```
node index.js
```
You may want to use pm2 to run it on a server so it records logs and will restart if it crashes:
```
pm2 start index.js
```