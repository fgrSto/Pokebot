const { SlashCommandBuilder, Client } = require("discord.js");
const { GetData } = require("../controller/controllerData");
const { FindProfile } = require("../controller/controller");

module.exports = {

    data: team = new SlashCommandBuilder()
    .setName("team")
    .setDescription("Afficher ou modifier l'équipe")
    .addStringOption(option => 
        option.setName("add")
        .setDescription("Ajouter un pokémon à l'équipe")
        .setRequired(false)
        .setAutocomplete(true))
    .addStringOption(option => 
        option.setName("remove")
        .setDescription("Retire un pokémon de l'équipe")
        .setRequired(false)
        .setAutocomplete(true),)
    .addStringOption(option =>
        option.setName("see")
        .setDescription("Voir l'équipe d'un joueur")
        .setRequired(false)),
        
    async run(bot, interaction) {
      let player = FindProfile(bot, interaction.member.user.id);
      let pokemons = GetData("pokemons")
      let focusedOption = interaction.options.getFocused(true)
      let choices = []

      if(focusedOption.name == "add") {
        pokemons.forEach(poke => {
          if(player.inventory.includes(poke.id)) {
            choices.push({name: poke.name.french, value: poke.id})
          }
        });
      }

      let filteredChoices = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())).slice(0, 25)
      await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
    }
    
}