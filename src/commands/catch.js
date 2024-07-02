const { FindProfile } = require("../controller/controller");
const { Catch } = require("../controller/controllerPokemon");

module.exports = {
  name: "catch",
  description: "Permet d'attraper un pokémon",

  async run(bot, interaction) {
    FindProfile(bot, interaction);
    console.log(Catch());
  },
};
