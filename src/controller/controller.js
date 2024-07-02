const { GetData, WriteData } = require("./controllerData");
const Profile = require("../profile");

function FindProfile(bot, interaction) {
  let listeProfiles = GetData("data");
  return listeProfiles.find(
    (player) => player.id == interaction.member.user.id
  );
}

module.exports = { FindProfile };
