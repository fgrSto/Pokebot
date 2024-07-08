const Discord = require("discord.js");
const bot = new Discord.Client({ intents: 3276799 });
const loadCommands = require("./src/loaders/loadCommands.js");
const loadSlashCommands = require("./src/loaders/loadSlashCommands");
const { commandHandler } = require("./src/commandHandler.js");
const { GetData, WriteData } = require("./src/controller/controllerData.js");
const value = require("./src/value.js");
const { embedProfile } = require("./src/controller/controller.js");
require("dotenv").config();
bot.commands = new Discord.Collection();

loadCommands(bot);

setInterval(() => { //update profiles
  if(value.lastProfil != null) {
    value.lasMsgProfil.edit(embedProfile(value.lastProfil))
  } 
}, 30000);

bot.on("ready", async () => {
  console.log("bot online");
  console.log(new Date().toLocaleString());
  await loadSlashCommands(bot);
});

bot.on("interactionCreate", (interaction) => {
  commandHandler(bot, interaction);
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {
  let listeProfiles = GetData("data");
  for (let i = 0; i < listeProfiles.length; i++) {
    if (listeProfiles[i].id == oldMember.id) {
      listeProfiles[i].displayName = newMember.displayName;
    }
  }
  WriteData("data", listeProfiles);
});

bot.login(process.env.BOT_TOKEN);
