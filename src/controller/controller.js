const { GetData, WriteData } = require("./controllerData");
const Profile = require("../profile");

function FindProfile(bot, interaction) {
  let listeProfiles = GetData("data");
  return listeProfiles.find(
    (player) => player.id == interaction.member.user.id
  );
}

function timeBetween(date_1, date_2) {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = (difference / 1000) / 60 ;
  return TotalDays;
}

module.exports = { FindProfile, timeBetween };
