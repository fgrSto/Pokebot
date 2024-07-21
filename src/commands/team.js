const { SlashCommandBuilder, Client } = require("discord.js");
const { GetData, WriteData } = require("../controller/controllerData");
const { FindProfile, SendProfile, CheckPerms, CheckSucces } = require("../controller/controller");
const { SendError, SendNotError } = require("../controller/controllerMessages");
const combineImage = require("combine-image");


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
        .setAutocomplete(true))
    .addUserOption(option => 
        option.setName("joueur")
        .setDescription("Voir l'équipe d'un joueur")
        .setRequired(false)),
        
    async run(bot, interaction) {
      let player = FindProfile(bot, interaction.member.user.id);
      let listeProfiles = GetData("data");
      let pokemons = GetData("pokemons")
      let paramsAdd = interaction.options ? interaction.options._hoistedOptions.find(option => option.name == "add") : {name: "add", value: interaction.values[0]}
      let paramsRemove = interaction.options ? interaction.options._hoistedOptions.find(option => option.name == "remove") : undefined

      if (!CheckPerms(interaction)) return
      if (interaction.options ? interaction.options._hoistedOptions.length > 1 : false) return SendError("Frero fais un effort stp", interaction)

      if (interaction.isAutocomplete()) {
        let focusedOption = interaction.options.getFocused(true)
        let choices = []

        if(focusedOption.name == "add") {
          pokemons.forEach(poke => {
            if(player.inventory.includes(poke.id)) {
              choices.push({name: poke.name.french, value: poke.id})
            }
          });
          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())).slice(0, 25)
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
        } else if(focusedOption.name == "remove")
        {
          pokemons.forEach(poke => {
            if(player.team.includes(poke.id)) {
              choices.push({name: poke.name.french, value: poke.id})
            }
          });
          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())).slice(0, 25)
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
        }
      } 

      else {
        if (paramsAdd ? paramsAdd.name == "add" : false) {
          if (!pokemons.find(pokemon => pokemon.id == paramsAdd.value)) return SendError("Pokémon introuvable", interaction)
          if (player.team.length >= 6) {
            SendError("L'équipe est complète", interaction)
            return
          } else {
            let index = player.inventory.indexOf(parseInt(paramsAdd.value))    
            if (index > -1) {
              player.inventory.splice(index, 1)
              player.team.push(parseInt(paramsAdd.value))
              SendNotError(`**${pokemons.find(pokemon => pokemon.id == paramsAdd.value).name.french}** a été ajouté à l'équipe`, interaction)
            } else {
              return SendError(`Ce pokémon est déjà dans l'équipe`, interaction)
            }
          }
        }
        else if (paramsRemove ? paramsRemove.name == "remove" : false) {
          if (!pokemons.find(pokemon => pokemon.id == paramsRemove.value)) return SendError("Pokémon introuvable", interaction)
          if (player.team.length <= 0) {
            SendError("L'équipe est vide", interaction)
            return
          } else {
            let index = player.team.indexOf(parseInt(paramsRemove.value))    
            if (index > -1) {
              player.team.splice(index, 1)
              player.inventory.push(parseInt(paramsRemove.value))
              SendNotError(`**${pokemons.find(pokemon => pokemon.id == paramsRemove.value).name.french}** a été retiré de l'équipe`, interaction)
            }
          }
        } else {
          let watchedPlayer = FindProfile(bot, interaction.options._hoistedOptions.find(option => option.name == "joueur") ? interaction.options._hoistedOptions.find(option => option.name == "joueur").user.id : player.id);
          if (!watchedPlayer) return SendError("Joueur introuvable", interaction)
          interaction.deferReply()

          setTimeout(() => {
            let photos = []
            for (let i = 0; i < 6; i++) {
                if (watchedPlayer.team[i]) {
                    photos.push(GetData("pokemons").find(pokemon => pokemon.id == watchedPlayer.team[i]).hires ? GetData("pokemons").find(pokemon => pokemon.id == watchedPlayer.team[i]).hires : GetData("pokemons").find(pokemon => pokemon.id == watchedPlayer.team[i]).thumbnail)
                } else {
                    photos.push("https://i.imgur.com/9OIW87s.png")
                }
            }
            combineImage(photos).then((image) => {
                image.write('team.png',  () => {
                    SendProfile(watchedPlayer, interaction)
                })
            })
        }, 700);
        }

        for (let i = 0; i < listeProfiles.length; i++) {
          if (listeProfiles[i].id == player.id) {
            listeProfiles[i] = player;
          }
        }
        listeProfiles = CheckSucces(bot, interaction, player, {id: 0}, listeProfiles)
        WriteData("data", listeProfiles);
       }
    }
}