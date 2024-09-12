const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { sortPoke } = require("./interactions/inventaire");
const { removeDuplicates, FindProfile } = require("../controller/controller");
const { findColor } = require("../controller/controllerPokemon");
const { GetData, WriteData } = require("../controller/controllerData");
const { SendError } = require("../controller/controllerMessages");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("sell")
  .setDescription("Vendre un pokémon a un joueur")
  .addStringOption(option =>
    option.setName("pokémon")
    .setDescription("Pokémon à vendre")
    .setAutocomplete(true)
    .setRequired(true)
  )
  .addUserOption(option => 
    option.setName("joueur")
    .setDescription("Nom du joueur a qui vendre le pokémon")
  )
  .addIntegerOption(option =>
    option.setName("prix")
    .setDescription("Prix de vente du pokémon")
    .setMinValue(1)
    .setMaxValue(10000)
  )
  .addStringOption(option =>
    option.setName("echange")
    .setDescription("Pokémon à échanger")
    .setAutocomplete(true)
  ),

  async run (bot, interaction) {
    let player = FindProfile(interaction.member.user.id);

    if(interaction.isAutocomplete()) {
      if (player) {
        let focusedOption = interaction.options.getFocused(true)
        let choices = []
        
        if(focusedOption.name == "pokémon") {
          let listeInv = sortPoke(player.inventory)
          listeInv = removeDuplicates(listeInv)
          
          listeInv.forEach(poke => {
            choices.push({name: `${findColor(poke)} ${poke.name.french}`, value: poke.id})
          });
          
          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25)      
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))

        }else if(focusedOption.name == "echange"){
          let listePoke = GetData("pokemons")
          listePoke = listePoke.map(a => a.id)
          listePoke = sortPoke(listePoke)

          listePoke.forEach(poke => {
            choices.push({name: `${findColor(poke)} ${poke.name.french}`, value: poke.id})
          });
          
          let filteredChoices = choices.filter(choice => choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())).slice(0, 25)      
          await interaction.respond(filteredChoices.map(choice => ({ name: choice.name, value: choice.value.toString()})))
        }
      }
    }else{

      if(!interaction.options._hoistedOptions.some(option => option.name == "prix") && !interaction.options._hoistedOptions.some(option => option.name == "echange")) return SendError("Spécifie un prix ou un pokémon contre lequel tu veux échanger ton pokémon", interaction)
      if(interaction.options._hoistedOptions.some(option => option.name == "prix") && interaction.options._hoistedOptions.some(option => option.name == "echange")) return SendError("Entre seulement un prix ou un pokémon", interaction)

      let pokemons = GetData("pokemons")
      let pokemonEch = null
      let targetPlayer = null
      let pokemon = pokemons.find(pokemon => pokemon.id == interaction.options._hoistedOptions.find(option => option.name == "pokémon").value)

      if(!pokemon) return SendError("Pokémon introuvable", interaction)
      let desc = `**${player.displayName}** veux vendre **${pokemon.name.french}** `

      if(interaction.options._hoistedOptions.some(option => option.name == "joueur")) {
        targetPlayer = FindProfile(interaction.options._hoistedOptions.find(option => option.name == "joueur").value)
        
        if(targetPlayer == undefined) return SendError("joueur introuvable", interaction)
        desc += `à **${targetPlayer.displayName}**`     
      }

      if(interaction.options._hoistedOptions.some(option => option.name == "echange")) {
        pokemonEch = pokemons.find(pokemon => pokemon.id == interaction.options._hoistedOptions.find(option => option.name == "echange").value)
        desc += `\n\n**Contre :**\n` + "`" + `${findColor(pokemonEch)} ${pokemonEch.name.french}` + "`"
      }else if(interaction.options._hoistedOptions.some(option => option.name == "prix")){
        desc += `\n\n**Prix :**\n` + "`" + interaction.options._hoistedOptions.find(option => option.name == "prix").value + " 💵`"
      }

      let btns = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`acceptBuy/${interaction.member.user.id}/${pokemon.id}/${pokemonEch != null ? "echange" : "price"}/${pokemonEch != null ? pokemonEch.id : interaction.options._hoistedOptions.find(option => option.name == "prix").value}/${targetPlayer ? targetPlayer.id : null}`)
        .setLabel("Accepter l'offre")
        .setStyle("Success")
      )

      interaction.reply({embeds: [new EmbedBuilder()
        .setAuthor({
          name: interaction.member.user.globalName,
          iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`,
        })
        .setColor("#FCD53F")
        .setDescription(desc)
        .setThumbnail(pokemon.hires ? pokemon.hires : pokemon.thumbnail)
        .setFooter({
          text: `\u200b`,
          iconURL: `https://static-00.iconduck.com/assets.00/label-emoji-2048x1768-yvo1vpgs.png`,
        })
        .setTimestamp(),
      ],
      components: [btns]})
      let listeProfiles = GetData("data")
      for (let i = 0; i < listeProfiles.length; i++) {
        if (listeProfiles[i].id == player.id) {
          listeProfiles[i] = player;
        }
      }
      WriteData("data", listeProfiles);
    }
  }
}