const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

module.exports = async (bot) => {
  let commands = [];

  bot.commands.forEach(async (command) => {
    let slashCommand = new Discord.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);

    if (command.options?.length >= 1) {
      for (let i = 0; i < command.options.length; i++) {
        if (command.options[i].minValue != undefined) {
          slashCommand[`add${command.options[i].type}Option`]((option) =>
            option
              .setName(command.options[i].name)
              .setDescription(command.options[i].description)
              .setRequired(command.options[i].required)
              .setMinValue(
                command.options[i].minValue != undefined
                  ? command.options[i].minValue
                  : undefined
              )
          );
        } else if (command.options[i].choices != undefined) {
          slashCommand[`add${command.options[i].type}Option`]((option) =>
            option
              .setName(command.options[i].name)
              .setDescription(command.options[i].description)
              .setRequired(command.options[i].required)
          );

          command.options[i].choices.forEach((choice) => {
            slashCommand.options[i].addChoices(choice);
          });
        } else {
          slashCommand[`add${command.options[i].type}Option`]((option) =>
            option
              .setName(command.options[i].name)
              .setDescription(command.options[i].description)
              .setRequired(command.options[i].required)
          );
        }
      }
    }
    +commands.push(slashCommand);
  });

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
  await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
};

