const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { GetData, WriteData } = require("../controller/controllerData");
const { FindProfile, CheckPerms, CheckSucces, removeDuplicates } = require("../controller/controller");
const { SendError, SendNotError } = require("../controller/controllerMessages");
const combineImage = require("combine-image");
const { findColor } = require("../controller/controllerPokemon");
const { Inventaire, sortPoke } = require("./interactions/inventaire");


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
      let player = FindProfile( interaction.member.user.id);
      let listeProfiles = GetData("data");
      let pokemons = GetData("pokemons")
      let paramsAdd = interaction.options ? interaction.options._hoistedOptions.find(option => option.name == "add") : interaction.customId.split("/")[2] == "add" ? {name: "add", value: interaction.values[0]} : undefined
      let paramsRemove = interaction.options ? interaction.options._hoistedOptions.find(option => option.name == "remove") : interaction.customId.split("/")[2] == "remove" ? {name: "remove", value: interaction.values[0]} : undefined   

      if (!CheckPerms(interaction)) return
      if (interaction.options ? interaction.options._hoistedOptions.length > 1 : false) return SendError("Frero fais un effort stp", interaction)

      if (interaction.isAutocomplete()) {
        let focusedOption = interaction.options.getFocused(true)
        let choices = []

        if(focusedOption.name == "add") {
          let listeInv = sortPoke(player.inventory)
          listeInv = removeDuplicates(listeInv)
          
          listeInv.forEach(poke => {
            choices.push({name: `${findColor(poke)} ${poke.name.french}`, value: poke.id})
          });
          
          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25)
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))

        } else if(focusedOption.name == "remove") {
          let listeTeam = sortPoke(player.team)
          listeTeam = removeDuplicates(listeTeam)

          listeTeam.forEach(poke => {
            choices.push({name: `${findColor(poke)} ${poke.name.french}`, value: poke.id})
          });

          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25)
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
        }
      } else {
        
        if ((paramsAdd ? paramsAdd.name == "add" : false)) {
          if (!pokemons.find(pokemon => pokemon.id == paramsAdd.value)) return SendError("Pokémon introuvable", interaction)
          if (player.team.some(id => id == parseInt(paramsAdd.value))) return SendError("Pokémon déjà dans l'équipe", interaction)
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
          if (!player.team.includes(parseInt(paramsRemove.value))) return SendError("Ce pokémon n'est pas dans l'équipe", interaction)
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
          let watchedPlayer = FindProfile( interaction.options._hoistedOptions.find(option => option.name == "joueur") ? interaction.options._hoistedOptions.find(option => option.name == "joueur").user.id : player.id);
          if (!watchedPlayer) return SendError("Joueur introuvable", interaction)
          interaction.deferReply()

          let team = []
          for (let i = 0; i < player.team.length; i++) {
            let poke = pokemons.find(pokemon => pokemon.id == player.team[i])
            team.push({label: `${findColor(poke)} ${poke.name.french}`, value: poke.id.toString()})
          }

          let teamButtons = []
          

          if(team.length > 0) {
            teamButtons.push (new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
              .setCustomId(`team/${interaction.member.user.id}/remove`)
              .setPlaceholder(`❌ Retirer de l'équipe`)
              .setOptions(team)
            ))
          }

          if (player.inventory.length > 0) {
            teamButtons.push (new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
              .setCustomId(`team/${interaction.member.user.id}/add`)
              .setPlaceholder(`📥 Ajouter à l'équipe`)
              .setOptions(Inventaire(bot, interaction, 1).pokemonsRarityList)
            ))
          }


          let desc = ""
          let photos = []
          for (let i = 0; i < 6; i++) {
              if (watchedPlayer.team[i]) {
                let poke = GetData("pokemons").find(pokemon => pokemon.id == watchedPlayer.team[i])
                desc +=`${findColor(poke)} [${poke.name.french}](<https://www.pokepedia.fr/${poke.name.french}>)\n`
                photos.push(poke.hires ? poke.hires : poke.thumbnail)
              } else {
                desc += `<:Pokeball:1265664986034995255> _Vacant_\n`
                photos.push("https://i.imgur.com/9OIW87s.png")
              }
          }
          combineImage(photos).then((image) => {
              image.write('team.png',  () => {
                setTimeout(() => {
                  interaction.editReply({embeds: [new EmbedBuilder()
                    .setColor("#64c8c8")
                    .setTitle(`Équipe de ${watchedPlayer.displayName}`)
                    .setDescription(desc)
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${watchedPlayer.id}/${watchedPlayer.avatar}.png`)
                    .setImage("attachment://team.png"),
                  ],
                  components: teamButtons,
                  files: ["team.png"],})
                }, 700);
              })
          })
        }

        for (let i = 0; i < listeProfiles.length; i++) {
          if (listeProfiles[i].id == player.id) {
            listeProfiles[i] = player;
          }
        }
        listeProfiles = CheckSucces(interaction, player, {id: 0}, listeProfiles)
        WriteData("data", listeProfiles);
       }
    }
}