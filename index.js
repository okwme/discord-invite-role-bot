const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require("process");
// const guildID = '802256309302460486' // test server
const guildID = '669268347736686612' // cosmos server
const client = new Discord.Client();
// Initialize the invite cache
const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
  // "ready" isn't really ready. We need to wait a spell.
  await wait(1000);

  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then(guildInvites => {
    
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    if (invite !== null) {
      addRole(member, invite)
    }
  });
});

const prefix = "~";
client.on("message", function(message) { 
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const guild = client.guilds.cache.get(guildID) // get the guild object
  const member = guild.member(message.author) // convert the User object to a GuildMember!
  if (!member.hasPermission("ADMINISTRATOR")) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();


  switch(command){
    case('add'):
      add(message, args)
      break;
    case('remove'):
      remove(message, args)
      break
    case('list'):
      list(message)
      break;
    default:
      message.reply(`command doesn't exist`)
  }

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);              
  }   
});    

function addRole(member, invite) {
  let rawdata = fs.readFileSync('invites.json');
  let _invites = JSON.parse(rawdata);
  const {roleID} = _invites[invite.code]
  if (roleID) {
    var role = member.guild.roles.cache.find(role => role.id === roleID);
    member.roles.add(role);
  }
}

function list(message) {

  let rawdata = fs.readFileSync('invites.json');
  let _invites = JSON.parse(rawdata);
  message.reply(`\`\`\`\n${JSON.stringify(_invites, null, 2)}\n\`\`\``)
}

function add(message, args) {
  let rawdata = fs.readFileSync('invites.json');
  let _invites = JSON.parse(rawdata);

  if (args.length !== 2) {
    message.reply(`not enough arguments`)
    return
  }
  const base = 'https://discord.gg/'
  if (args[0].substring(0, base.length) !== base) {
    message.reply(`missing link starting with \`${base}\``);
    return
  }
  const inviteCode = args[0].substring(base.length)
  const roleprefix = '<@&'
  if (args[1].substring(0, roleprefix.length) !== roleprefix) {
    message.reply(`invalid role`);
    return
  }
  const roleID = args[1].substr(roleprefix.length, args[1].length - roleprefix.length - 1)
  let role = message.guild.roles.cache.find(x => x.id === roleID);

  if (typeof role === undefined) {
      message.reply(`invalid role`);
      return
  }

  _invites[inviteCode] = {roleID, name: role.name}

  let data = JSON.stringify(_invites, null, 2);
  fs.writeFileSync('invites.json', data);
  message.reply(`role @${role.name} added to invite link \`${base + inviteCode}\``)
}

client.login(config.BOT_TOKEN);
