const Discord = require("discord.js");
const bot = new Discord.Client({ intents: 3276799 });
const loadCommands = require("./src/loaders/loadCommands.js");
const loadSlashCommands = require("./src/loaders/loadSlashCommands");
const { commandHandler } = require("./src/commandHandler.js");
require("dotenv").config();
bot.commands = new Discord.Collection();

loadCommands(bot);

bot.on("ready", async () => {
  console.log("bot online");
  console.log(new Date().toLocaleString());
  await loadSlashCommands(bot);
});

bot.on("interactionCreate", async (interaction) => {
  commandHandler(bot, interaction);
});

bot.login(process.env.BOT_TOKEN);
