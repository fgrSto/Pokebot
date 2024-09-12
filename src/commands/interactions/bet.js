const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { GetData, WriteData } = require("../../controller/controllerData");
const { FindProfile, toHHMMSS, timeBetween, CheckSucces } = require("../../controller/controller");
const { DateTime } = require("luxon");
const { SendError } = require("../../controller/controllerMessages");

function betDescription(player, bet) {
  let description = ""

  if(player.id == bet.bestBetPlayer) { // a changer avant de push par "=="
    description += `*Personne n'a ajouté de mise sur ce pokémon*\n\nPrix actuel : ` + "`" + bet.price + " 💵`\nTemps restant : `" + toHHMMSS(172800 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(bet.time))) + "`"
  }else{
    description += `Gagnant actuel : **${FindProfile(bet.bestBetPlayer).displayName}**\nEnchère actuelle : ` + "`" + (bet.history.length > 0 ? bet.history[bet.history.length - 1].amount : bet.price) + " 💵`\nTemps restant : **" + toHHMMSS(172800 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(bet.time))) + "**\n"
    if(bet.history.length > 0) {
      description += `\n**Historique :** \n`
      
      for (let i = bet.history.length - 1; i > (bet.history.length < 5 ? - 1 : bet.history.length - 6) ; i--) {     
        let auction = bet.history[i]
        
        description += `**${auction.name} :** ` + "`" + auction.amount + " 💵`\nIl y a : " + `**${toHHMMSS(timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(auction.time)))}**\n\n`
      }
    }
  }

  return description
}

function showBet(interaction) {
  let bet = findBet(interaction.values[0])
  if(!bet) return SendError("Action impossible", interaction)
  let player = FindProfile(interaction.member.id)
  let poke = GetData("pokemons").find(poke => poke.id == bet.pokeId)

  let description = betDescription(player, bet)

  let btn = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId(`addBet/${bet.id}/1`)
      .setStyle("Secondary")
      .setLabel("+ 1")
    )
    .addComponents(
      new ButtonBuilder()
      .setCustomId(`addBet/${bet.id}/10`)
      .setStyle("Secondary")
      .setLabel("+ 10")
    )
    .addComponents(
      new ButtonBuilder()
      .setCustomId(`addBet/${bet.id}/100`)
      .setStyle("Secondary")
      .setLabel("+ 100")
    )
    .addComponents(
      new ButtonBuilder()
      .setCustomId(`addBet/${bet.id}/1000`)
      .setStyle("Secondary")
      .setLabel("+ 1000")
    )
  let closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`close/${interaction.member.user.id}`)
      .setLabel("❌")
      .setStyle("Secondary"),
  )

  interaction.reply({embeds: [new EmbedBuilder()
    .setAuthor({name: player.displayName, iconURL: `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png`})
    .setTitle(`${bet.name} de ${player.displayName}`)
    .setThumbnail(poke.hires ? poke.hires : poke.thumbnail)
    .setColor("#00b0f4")
    .setDescription(description)
  ],
  components: [btn, closeBtn]
})
}

function findBet(id) {
  let listeProfiles = GetData("data")
  for (let player of listeProfiles) {
    let bet = player.trades.find(trade => trade.id === id)
  
    if(bet != undefined) {
      return bet
    }
  }
  return null 
}

function addBet(interaction) {
  let bet = findBet(interaction.customId.split("/")[1])
  let player = FindProfile(interaction.member.id)
  let augmentation = parseInt(interaction.customId.split("/")[2])
  let tradeAuthor = FindProfile(bet.author)
  let listeProfiles = GetData("data")

  if(!player) return SendError("PTDR T KI", interaction)
  if(bet.author == player.id) return SendError("Action impossible", interaction)
  if(bet.price + augmentation > player.money) return SendError("Va voir ton banquier avant", interaction)

  bet.history.push({id: player.id, name: player.displayName, time: new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), amount: augmentation + parseInt(bet.history.length > 0 ? bet.history[bet.history.length - 1].amount : bet.price)})
  bet.bestBetPlayer = player.id
  
  tradeAuthor.trades[tradeAuthor.trades.findIndex(Bet => Bet.id == bet.id)] = bet
  
  interaction.message.embeds[0].data.description = betDescription(tradeAuthor, bet)
  interaction.update({embeds: interaction.message.embeds,components: interaction.message.components});
  
  interaction.channel.send({embeds: [new EmbedBuilder()
    .setDescription(`**${player.displayName}** a augmenté l'enchère de **${bet.name}** à **${bet.history[bet.history.length - 1].amount} 💵**`)
    .setColor("Green")
  ],fetchReply: true})
  .then(sent => {
    setTimeout(() => {
        sent.delete()
    }, 3000);
  });

  for (let i = 0; i < listeProfiles.length; i++) {
    if (listeProfiles[i].id == player.id) {
      listeProfiles[i] = player
    }
    if(listeProfiles[i].id == tradeAuthor.id) {
      listeProfiles[i] = tradeAuthor
    }
  }
  listeProfiles = CheckSucces(interaction, player, {id: 0}, listeProfiles)
  WriteData("data", listeProfiles);
  
}

module.exports = { showBet, findBet, addBet }