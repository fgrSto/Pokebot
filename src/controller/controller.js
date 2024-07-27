const { GetData, WriteData } = require("./controllerData");
const { Succes } = require("../succes");
const { SendSucces, SendError } = require("./controllerMessages");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const value = require("../value");
const { Bagdes } = require("../badges");

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

  return `${hours}h${minutes < 10 ? `0${minutes}` : minutes}`;
}

function CheckSucces(bot, interaction, player, pokemon, listeProfiles) {
  let prevTeam = [...player.team]
  player.team.sort(function(a, b) {return a - b}).toString()
  Succes(player, pokemon).forEach((succ) => {
    if (succ.cond && !player.succes.includes(succ.id)) {
      SendSucces(succ, interaction);
      player.succes.push(succ.id);

      for (let i = 0; i < listeProfiles.length; i++) {
        if (listeProfiles[i].id == player.id) {
          listeProfiles[i] = player;
        }
      }
    }
  });
  player.team = prevTeam

  Bagdes(player).forEach((badge) => {
    let bestPlayer = null
    if(badge.id == 1) { //catch
      bestPlayer = listeProfiles.sort((a, b) => a.stats.totalCatch.total < b.stats.totalCatch.total ? 1 : -1)[0]
    }else if(badge.id == 2) { //money
      bestPlayer = listeProfiles.sort((a, b) => a.money < b.money ? 1 : -1)[0]
    }

    if(badge.fixe == false) {
      for (let i = 0; i < listeProfiles.length; i++) {
        if((listeProfiles[i].id != bestPlayer.id) && (listeProfiles[i].badges.includes(badge.id))) {
          let index = listeProfiles[i].badges.indexOf(badge.id)
          if (index > -1) {
            listeProfiles[i].badges.splice(index, 1)
          }
    
        } else if((listeProfiles[i].id == bestPlayer.id) && (!listeProfiles[i].badges.includes(badge.id))) {
            listeProfiles[i].badges.push(badge.id)
        }
      }
    }else{
      if(!player.badges.includes(badge.id) && badge.cond == true) {
        player.badges.push(badge.id)

        for (let i = 0; i < listeProfiles.length; i++) {
          if (listeProfiles[i].id == player.id) {
            listeProfiles[i] = player;
          }
        }
      }
    }
  })
  return listeProfiles;
}

function getNumOfTimes(arrayOfNums) {
  let found = {};
  for (let i = 0; i < arrayOfNums.length; i++) {
    let keys = arrayOfNums[i];
    found[keys] = ++found[arrayOfNums[i]] || 1;
  }

  return found;
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function embedProfile(user, interactionUserId) {
  let listButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`catch/${user.id}`)
      .setLabel(`🐹 Catch`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`inventaire/${user.id}/1`)
      .setLabel(`💼 Inventaire`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`succes/${user.id}`)
      .setLabel(`🏆 Succès`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`stats/${user.id}`)
      .setLabel(`📊 Statistiques`)
      .setStyle("Secondary")
  );

  let listPrivateButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`succes/${user.id}`)
      .setLabel(`🏆 Succès`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`stats/${user.id}`)
      .setLabel(`📊 Statistiques`)
      .setStyle("Secondary")
  );

  let badges = [];
  user.badges.forEach((badgeId) => {
    badges.push(Bagdes(user).find((badge) => badge.id == badgeId).icon);
  });

  return {
    embeds: [
      new EmbedBuilder()
        .setColor("#64c8c8")
        .setTitle(`Profil de ${user.displayName}`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
        .setDescription(user.badges == [] ? "\u200b" : `${badges.join(" ")} \n \u200b`)
        .addFields(
          { name: `Argent 💵`, value: `${user.money} $`, inline: true },
          { name: `Prochain catch <:Pokeball:1265664986034995255>`, value:timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(user.lastCatch)) <= 21600 ? `🔴 ${toHHMMSS(21600 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })), new Date(user.lastCatch)))}` : `🟢 Disponible`,inline: true },
          { name: `Succès 🏆`, value: `${user.succes.length} / ${Succes(user).length}`, inline: true },
          { name: "\u200b", value: `**Équipe :**` }
        )
        .setImage("attachment://team.png"),
    ],
    components: [
      user.id == interactionUserId ? listButtons : listPrivateButton,
    ],
    files: ["team.png"],
  };
}

function SendProfile(user, interaction) {
  interaction
    .editReply(embedProfile(user, interaction.member.id))
    .then((sent) => {
      value.lasMsgProfil = sent;
      value.lastProfil = user;

      setTimeout(() => {
        if (sent.id == sent.id) {
          value.lastProfil = null;
          value.lasMsgProfil = null;
          sent.delete();
        } else {
          sent.delete();
        }
      }, 300000);
    });
}

function CheckPerms(interaction) {
  if (interaction.member.id == (interaction.customId == undefined ? interaction.member.id : interaction.customId.split("/")[1])) {
    return true;
  } else {
    SendError("Action impossible", interaction);
    return false;
  }
}

module.exports = {
  FindProfile,
  timeBetween,
  toHHMMSS,
  CheckSucces,
  SendProfile,
  embedProfile,
  CheckPerms,
  getNumOfTimes,
  removeDuplicates,
};
