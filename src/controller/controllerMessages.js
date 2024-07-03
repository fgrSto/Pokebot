const { EmbedBuilder } = require("discord.js");

function SendError(message, interaction) {
  interaction.reply({
    embeds: [new EmbedBuilder().setDescription(message).setColor("Red")], fetchReply: true
  }).then(sent => {
    setTimeout(() => {
        sent.delete()
    }, 3000);
  });
}

module.exports = { SendError };
