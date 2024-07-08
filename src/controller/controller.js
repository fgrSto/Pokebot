const { GetData } = require("./controllerData");
const { Succes } = require("../succes");
const { SendSucces } = require("./controllerMessages");
const { EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const value = require("../value")

function FindProfile(bot, member) {
  let listeProfiles = GetData("data");
  return listeProfiles.find((player) => player.id == member.user.id);
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
  var seconds = sec_num % 60;

  return [hours, minutes]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join("h");
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

function embedProfile(user) {
  return {
    embeds: [new EmbedBuilder()
      .setColor("#64c8c8")
      .setTitle(`Profil de ${user.displayName}`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
      .setDescription(user.badges ? user.badges.join(" ") : "\u200b")
      .addFields(
        {name: `Argent 💵`, value: `${user.money} $`, inline: true},
        {name: `Prochain catch <:pokeball:1259699629025398894>`, value: timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })),new Date(user.lastCatch)) <= 21600 ? `🔴 ${toHHMMSS(21600 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })),new Date(user.lastCatch)))}`: `🟢 Disponible`, inline: true},
        {name: `Succès 🏆`, value: `${user.succes.length} / ${Succes(user).length}`, inline: true},
        {name: "\u200b", value: `**Équipe :**`}
      )
      .setImage("attachment://team.png")
    ], files: [
      "team.png"
    ]
  }
}

function SendProfile(user, interaction) {
  interaction.editReply(embedProfile(user)).then(sent => {
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

module.exports = {
  FindProfile,
  timeBetween,
  toHHMMSS,
  CheckSucces,
  SendProfile,
  embedProfile
};
