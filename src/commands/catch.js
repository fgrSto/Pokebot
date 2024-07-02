const { FindProfile } = require("../controller/controller");
const { GetData, WriteData } = require("../controller/controllerData");
const { Catch } = require("../controller/controllerPokemon");
const Profile = require("../profile");
const { DateTime } = require("luxon");

module.exports = {
  name: "catch",
  description: "Permet d'attraper un pokémon",

  async run(bot, interaction) {
    let listeProfiles = GetData("data");
    let player = FindProfile(bot, interaction);

    if (!player) {
      player = new Profile(interaction.member);
      listeProfiles.push(player);
    }
    console.log(player);

    let pokemon = Catch();
    player.inventory.push(pokemon.id);
    player.stats.totalCatch[pokemon.rarete.stat]++;
    player.stats.totalCatch.total++;
    player.money += 5;
    player.stats.totalMoney += 5;
    player.lastCatch = DateTime.now()
      .setZone("Europe/Paris")
      .toISO({ includeOffset: false });

    listeProfiles.forEach(joueur => {
      if (joueur.id == player.id) {
        joueur = player;
      }
    });

    WriteData("data", listeProfiles);
  },
};
