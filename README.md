# Minimalist Discord Invite Role Bot
This is a very minimal discord bot that allows you to associate invites with specific roles so that when that invite is used, the role is automatically added.

## Install
```sh
git clone https://github.com/okwme/discord-invite-role-bot
cd discord-invite-role-bot
npm i
```

## Configuration
There's a file called `config.json.example`. Rename it `config.json` and add your discord Bot Token. To learn how to do this follow [these instructions](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js).
```sh
cp config.json.example config.json
```
You may want to delete the contents of `invites.json` which is used to store the invite codes. It is currently filled with invite codes for the [Cosmos Network discord](https://discord.gg/vcExX9T).
```sh
echo "{}" > invites.json
```

## Running
This is a single file node.js app so it can be run like:
```sh
node index.js
```
You may want to use [pm2](https://pm2.keymetrics.io/) to run it on a server so it records logs and will restart if it crashes:
```sh
pm2 start discord-invite-role-bot
pm2 save
```

## Use
Make sure the bot is:
 * added to your server
 * has admin permissions
 * in the list of roles the bot shows up above any roles it will be managing

To list all links
```sh
~list
```

To add a new role use:
```sh
~add https://discord.gg/abcdegh @role-name
```

To remove a role:
```sh
// NOT IMPLEMENTED
~remove https://discord.gg/abcdefgh
```