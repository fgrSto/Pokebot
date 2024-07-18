require("dotenv").config();
const { Collection, GatewayIntentBits, Client } = require("discord.js");
const bot = new Client({ intents: GatewayIntentBits.Guilds });
const fs = require('fs');
const { commandHandler } = require("./src/commandHandler.js");
const { GetData, WriteData } = require("./src/controller/controllerData.js");
const value = require("./src/value.js");
const { embedProfile, FindProfile } = require("./src/controller/controller.js");
const path = require("path");

bot.commands = new Collection()
bot.commandArray = []

setInterval(() => {//update profiles
  if (value.lastProfil != null) {
    value.lasMsgProfil.edit(embedProfile(FindProfile(bot, value.lastProfil.id), value.lasMsgProfil.interaction.user.id));
  }
}, 30000);

bot.on("ready", async () => {
  const foldersPath = path.join(__dirname, '/src/commands');
  const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    bot.commands.set(command.data.name, command);
    await bot.application.commands.create(command.data)
  }

  console.log("bot online");
  console.log(new Date().toLocaleString());
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
