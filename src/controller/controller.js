const { GetData } = require("./controllerData");
const { Succes } = require("../succes");
const { SendSucces, SendError } = require("./controllerMessages");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const value = require("../value")

function FindProfile(bot, id) {
  let listeProfiles = GetData("data");
  return listeProfiles.find((player) => player.id == id);
}

function timeBetween(date_1, date_2) {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = difference / 1000;
  return TotalDays;
}

function toHHMMSS(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;

  return `${hours}h${minutes < 10 ? `0${minutes}` : minutes}`
}

function CheckSucces(bot, interaction, player, pokemon) {
  Succes(player, pokemon).forEach((succ) => {
    if (succ.cond && !player.succes.includes(succ.id)) {
      SendSucces(succ, interaction);
      player.succes.push(succ.id);
    }
  });
  return player;
}

function embedProfile(user, interactionUserId) {

  let listButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(`catch/${user.id}`)
    .setLabel(`🐹 Catch`)
    .setStyle("Secondary"),
    new ButtonBuilder()
    .setCustomId(`inventaire/${user.id}`)
    .setLabel(`💼 Inventaire`)
    .setStyle("Secondary"),
    new ButtonBuilder()
    .setCustomId(`succes/${user.id}`)
    .setLabel(`🏆 Succès`)
    .setStyle("Secondary")
  )

  let listPrivateButton = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(`succes/${user.id}`)
    .setLabel(`🏆 Succès`)
    .setStyle("Secondary")
  )

  return {
    embeds: [new EmbedBuilder()
      .setColor("#64c8c8")
      .setTitle(`Profil de ${user.displayName}`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
      .setDescription(user.badges == [] ? "\u200b" : `${user.badges.join(" ")} \n \u200b` )
      .addFields(
        {name: `Argent 💵`, value: `${user.money} $`, inline: true},
        {name: `Prochain catch <:pokeball:1259699629025398894>`, value: timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })),new Date(user.lastCatch)) <= 21600 ? `🔴 ${toHHMMSS(21600 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })),new Date(user.lastCatch)))}`: `🟢 Disponible`, inline: true},
        {name: `Succès 🏆`, value: `${user.succes.length} / ${Succes(user).length}`, inline: true},
        {name: "\u200b", value: `**Équipe :**`}
      )
      .setImage("attachment://team.png")
    ], 
    components: [
      user.id == interactionUserId ? listButtons : listPrivateButton
    ],
    files: [
      "team.png"
    ]
  }
}

function SendProfile(user, interaction) {
  interaction.editReply(embedProfile(user, interaction.member.id)).then(sent => {
    value.lasMsgProfil = sent
    value.lastProfil = user

    setTimeout(() => {
      if (sent.id == sent.id) {
        value.lastProfil = null
        value.lasMsgProfil = null
        sent.delete()
      } else {
        sent.delete()
      }
    }, 300000);
  })
}

function CheckPerms(interaction) {
  if (interaction.customId.split("/")[1] == interaction.member.id) {
    return true
  } else {
    SendError("Action impossible", interaction)
    return false
  }
}

module.exports = {
  FindProfile,
  timeBetween,
  toHHMMSS,
  CheckSucces,
  SendProfile,
  embedProfile,
  CheckPerms
};
