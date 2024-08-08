const { InventoryTurnPages, SendInventory } = require("./commands/interactions/inventaire");
const { SellPokemon } = require("./commands/interactions/sell");
const { ShowStats } = require("./commands/interactions/stats");
const { SuccesTurnPages, SuccesSend } = require("./commands/interactions/succes");
const { Team } = require("./commands/team");
const { CheckPerms } = require("./controller/controller");
const { close } = require("./controller/controllerMessages");

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
    case "stats":
      ShowStats(bot, interaction);
      break;
    case "close":
      if (!CheckPerms(interaction)) return
      close(bot, interaction);
      break
    case "sell":
      SellPokemon(bot, interaction);
    break
    case "team":
      bot.commands.get("team").run(bot, interaction)
      break
    case "auction":
      bot.commands.get("auction").run(bot, interaction)
      break
  }
}

module.exports = { commandHandler };
