const { GetData } = require("./controllerData");

function FindProfile(bot, interaction) {
  let listeProfiles = GetData("data");
    console.log(interaction);
}

module.exports = { FindProfile };
