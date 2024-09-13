const { EmbedBuilder } = require("discord.js");
const { FindProfile } = require("../../controller/controller");
const { GetData, WriteData } = require("../../controller/controllerData");
const { SendError } = require("../../controller/controllerMessages");

function acceptBuy(bot, interaction) {
  let targetPlayer = null
  let price = null
  let echange = null
  let pokemons = GetData("pokemons")
  let pokemon = pokemons.find(pokemon => pokemon.id == interaction.customId.split("/")[2])
  let author = FindProfile(interaction.customId.split("/")[1])

  if(interaction.customId.split("/")[1] == interaction.member.id) return SendError("Action imposible", interaction)
  if(interaction.customId.split("/")[5] != "null") {
    targetPlayer = FindProfile(parseInt(interaction.customId.split("/")[5]))
    if(targetPlayer == undefined) return SendError("joueur introuvable", interaction)
    if(targetPlayer.id != interaction.member.id) return SendError("L'offre n'est pas pour toi", interaction)
  }else{
    targetPlayer = FindProfile(interaction.member.id)
  }
  
  if(interaction.customId.split("/")[3] == "price") {
    price = parseInt(interaction.customId.split("/")[4])
    if(targetPlayer.money >= price) {
      targetPlayer.money -= price
      targetPlayer.inventory.push(pokemon.id)

      author.money += price
      author.stats.totalMoney += price
    }
  }else{
    echange = pokemons.find(pokemon => pokemon.id == interaction.customId.split("/")[4])
    if(targetPlayer.inventory.includes(echange.id)) {
      targetPlayer.inventory.push(pokemon.id)

    }else return SendError("Tu n'as pas le pokémon pour faire l'échange", interaction)
  } 

  let index = author.inventory.indexOf(parseInt(pokemon.id))
  if (index > -1) {
    author.inventory.splice(index, 1)
  }else return SendError("Pokémon introuvable", interaction)

  interaction.reply({embeds: [new EmbedBuilder()
    .setDescription(`**${targetPlayer.displayName}** a acheté le **${pokemon.name.french}** de **${author.displayName}**`)
    .setColor("#FCD53F")
    .setFooter({
      text: `\u200b`,
      iconURL: `https://static-00.iconduck.com/assets.00/label-emoji-2048x1768-yvo1vpgs.png`,
    })
    .setTimestamp(),
  ]})

  interaction.message.delete()  
  let listeProfiles = GetData("data")
  for (let i = 0; i < listeProfiles.length; i++) {
    if (listeProfiles[i].id == author.id) {
      listeProfiles[i] = author;
    }
    if (listeProfiles[i].id == targetPlayer.id) {
      listeProfiles[i] = targetPlayer;
    }
  }
  WriteData("data", listeProfiles);
}

module.exports = { acceptBuy }