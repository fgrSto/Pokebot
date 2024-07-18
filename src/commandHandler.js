const {
  InventoryTurnPages,
  SendInventory,
} = require("./commands/interactions/inventaire");
const {
  SuccesTurnPages,
  SuccesSend,
} = require("./commands/interactions/succes");

function commandHandler(bot, interaction) {
  if (
    !interaction.isCommand() &&
    !interaction.isButton() &&
    !interaction.isStringSelectMenu() &&
    !interaction.isAutocomplete()
  ) {
    return;
  }

  const { commandName } = interaction;
  switch (commandName ? commandName : interaction.customId.split("/")[0]) {
    case "catch":
      bot.commands.get("catch").run(bot, interaction);
      break;
    case "p":
      bot.commands.get("p").run(bot, interaction);
      break;
    case "inventaire":
      SendInventory(bot, interaction, 1);
      break;
    case "arrow":
      InventoryTurnPages(bot, interaction);
      break;
    case "succes":
      SuccesSend(bot, interaction, 1);
      break;
    case "arrowSucces":
      SuccesTurnPages(bot, interaction);
      break;
  }
}

module.exports = { commandHandler };
