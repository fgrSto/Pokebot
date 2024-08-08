const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { FindProfile, CheckPerms } = require("../../controller/controller");
const { SendError } = require("../../controller/controllerMessages");

function ShowStats(bot, interaction) {
  if(interaction.customId.split("/")[3] ? (interaction.member.id != interaction.customId.split("/")[3]) : false) return SendError("Action impossible", interaction)

  let player = FindProfile( interaction.customId.split("/")[1]);
  let page = interaction.customId.split("/")[2]
  let embed = new EmbedBuilder()
    .setAuthor({name: `Statistiques de ${player.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png`})
    .setThumbnail(`https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png`)
    .setColor("White")
  let listButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`stats/${player.id}/general/${interaction.member.id}`)
      .setLabel("General 📊")
      .setStyle("Secondary")
      .setDisabled(page == "general" ? true : false),
    new ButtonBuilder()
      .setCustomId(`stats/${player.id}/combat/${interaction.member.id}`)
      .setLabel("Combats ⚔️")
      .setStyle("Secondary")
      .setDisabled(page == "combat" ? true : false),
    new ButtonBuilder()
      .setCustomId(`stats/${player.id}/type/${interaction.member.id}`)
      .setLabel("Type 🐹")
      .setStyle("Secondary")
      .setDisabled(page == "type" ? true : false),
  )
  let closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`close/${interaction.member.user.id}`)
      .setLabel("❌")
      .setStyle("Secondary"),
  )

  if(page === "general") {
    embed.addFields(
        {
          name: "__Argent__ 💵",
          value: ">>> Total: `" + player.stats.totalMoney + " $`\nActuel: `" + player.money + " $`\nDépensé: `" + (player.stats.totalMoney - player.money) + " $`"
        },{
          name: "__Catchs__ <:Pokeball:1265664986034995255>",
          value: ">>> Total: `" + player.stats.totalCatch.total + "`\nGods: `" + player.stats.totalCatch.god + "`\nUltra Beast: `" + player.stats.totalCatch.ultBeast + "`\nFabuleux: `" + player.stats.totalCatch.fab + "`\nLégendaires: `" + player.stats.totalCatch.legend + "`\nStandards: `" + player.stats.totalCatch.standard + "`"
        },{
          name: "__Trades__ 🏷️",
          value: ">>> Ventes Totales: `" + (player.stats.totalCatch.total - (player.inventory.length + player.team.length)) + "`\nVentes au jeu: `" + (player.stats.totalCatch.total - (player.inventory.length + player.team.length) - player.stats.trades.pokeSold) + "`\nVentes aux joueurs: `" + player.stats.trades.pokeSold + "`\nAchats aux joueurs: `" + player.stats.trades.pokeBuy + "`\nÉchanges: `" + player.stats.trades.trades + "`"
        }
      )
  }else if(page == "combat") {
    embed.addFields(
      {
        name: "__Combat Amicaux__ 👬",
        value: ">>> Total: `" + player.stats.combats.amical.total + "`\nGagnés: `" + player.stats.combats.amical.win + "`\nPerdus: `" + (player.stats.combats.amical.total - player.stats.combats.amical.win) + "`"
      },{
        name: "__Raids__ 🏎️",
        value: ">>> Total: `" + player.stats.combats.raid.total + "`\nTerminés: `" + player.stats.combats.raid.done + "`\nGagnés: `" + player.stats.combats.raid.win + "`"
      }
    )
  }else if(page == "type") {
    embed.addFields(
      {
        name: "__Type de pokémons__ 🐹",
        value: ">>> Bug: `" + player.type.Bug + "` \nDark: `" + player.type.Dark + "` \nDragon: `" + player.type.Dragon + "` \nÉlectrique: `" + player.type.Electric + "` \nFairy: `" + player.type.Fairy + "` \nFighting: `" + player.type.Fighting + "` \nFire: `" + player.type.Fire + "` \nFlying: `" + player.type.Flying + "` \nGhost: `" + player.type.Ghost + "` \nGrass: `" + player.type.Grass + "` \nGround: `" + player.type.Ground + "` \nIce: `" + player.type.Ice + "` \nNormal: `" + player.type.Normal + "` \nPoison: `" + player.type.Poison + "` \nPsychic: `" + player.type.Psychic + "` \nRock: `" + player.type.Rock + "` \nSteel: `" + player.type.Steel + "` \nWater: `" + player.type.Water + "`"
      }
    )
  }

  if(interaction.message.interaction ? interaction.message.interaction.commandName == "p" : false) {
    interaction.reply({
      embeds: [ embed ],
      components: [listButtons, closeBtn],
      fetchReply: true,
    }).then(sent => {
      setTimeout(() => {
          sent.delete()
      }, 300000);
    });
  }else{
    interaction.message.embeds[0] = embed
    interaction.update({embeds: interaction.message.embeds, components: [listButtons, closeBtn]});
  }
}

module.exports = { ShowStats }