const { GetData, WriteData } = require("./controllerData");
const Profile = require("../profile");
const { Succes } = require("../succes");
const { SendSucces } = require("./controllerMessages");

function FindProfile(bot, interaction) {
  let listeProfiles = GetData("data");
  return listeProfiles.find(
    (player) => player.id == interaction.member.user.id
  );
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
    Succes(player, pokemon).forEach(succ => {
      if (succ.cond && !player.succes.includes(succ.id)) {
        SendSucces(succ, interaction)
        player.succes.push(succ.id)
      }
    });
    return player
}

module.exports = { FindProfile, timeBetween, toHHMMSS, CheckSucces };
