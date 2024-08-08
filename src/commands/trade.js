const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { findColor } = require("../controller/controllerPokemon");
const { removeDuplicates, FindProfile, timeBetween, CheckSucces, toHHMMSS, checkAuctions } = require("../controller/controller");
const { sortPoke } = require("./interactions/inventaire");
const { GetData, WriteData } = require("../controller/controllerData");
const { DateTime } = require("luxon");
const { SendError, SendNotError } = require("../controller/controllerMessages");

module.exports = {

  data: trade = new SlashCommandBuilder()
  .setName("auction")
  .setDescription("Mettre un pokémon aux anchères")
  .addStringOption(option => 
    option.setDescription("Pokémon a mettre aux enchères")
    .setName("pokémon")
    .setRequired(false)
    .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName("prix")
    .setDescription("Prix de base")
    .setRequired(false)
    .setMaxValue(1000)
    .setMinValue(1)
  ),

  async run (bot, interaction) {
    let player = FindProfile(interaction.member.user.id);
    
    if(interaction.isAutocomplete()) {
      let focusedOption = interaction.options.getFocused(true)
      let choices = []

      let listeInv = sortPoke(player.inventory)
      listeInv = removeDuplicates(listeInv)
      
      listeInv.forEach(poke => {
        choices.push({name: `${findColor(poke)} ${poke.name.french}`, value: poke.id})
      });
      
      let filteredChoices = choices.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25)      
      await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
    }else{
      let listeProfiles = GetData("data")
      listeProfiles = checkAuctions(listeProfiles, interaction)

      if(interaction.options._hoistedOptions.length == 0) { //Voir les enchères  
        let listeEnchère = []
        let msgAuction = ""
        let n = 0
        
        listeProfiles.forEach(profil => {
          if(profil.trades.length > 0 && n <= 25) {
            if(n == 25) {
              msgAuction += "(...)"
            }else{
              msgAuction += `**__${player.displayName}__**:\n`
              profil.trades.forEach(trade => {
                listeEnchère.push({label: trade.name, value: trade.pokeId.toString()})
                msgAuction += trade.name + ": `" +  trade.price + " 💵` " + `(__${FindProfile( trade.bestBetPlayer).displayName}__)\nTemps restant: ` + "`" + toHHMMSS(172800 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(trade.time))) + "`\n\n"
                n ++
              });
            }
          }
        });

        if(msgAuction == "") {
          msgAuction = "Aucun pokémons n'ést aux enchères"
        }
        
        interaction.reply({embeds: [new EmbedBuilder()
          .setTitle("Enchères de pokémons")
          .setDescription(msgAuction)
          .setThumbnail("https://i.imgur.com/9OIW87s.png")
          .setColor("#00b0f4")
        ],
        fetchReply: true,
        components: [new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(`bet/${interaction.member.id}`)
            .setOptions(listeEnchère)
            .setPlaceholder("Ajouter a la mise")
          )
        ]

      }).then(sent => {
        setTimeout(() => {
            sent.delete()
        }, 300000);
      });

      }else{
        if(interaction.options._hoistedOptions.length != 2) return SendError("Le **prix** ou le **pokémon** n'est pas spécifié !", interaction)
        
        let pokemons = GetData("pokemons")
        let pokemon = pokemons.find(pokemon => pokemon.id == interaction.options._hoistedOptions.find(option => option.name == "pokémon").value)

        if(!pokemon) return SendError("Pokémon introuvable", interaction)
        
        let index = player.inventory.indexOf(parseInt(pokemon.id))
        if (index > -1) {
          player.inventory.splice(index, 1)
          player.trades.push({author: player.id, pokeId: pokemon.id, name:`${findColor(pokemon)} ${pokemon.name.french}`, price: interaction.options._hoistedOptions.find(option => option.name == "prix").value, bestBetPlayer: player.id, time: new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false }))})
          SendNotError(`**${pokemons.find(poke => poke.id == pokemon.id).name.french}** a été ajouté aux enchères`, interaction)
        } else {
          return SendError(`Ce pokémon est déjà aux enchères`, interaction)
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
}