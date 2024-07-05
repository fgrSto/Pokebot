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

function SendSucces(succ, interaction) {
  setTimeout(() => {
    interaction.channel.send({embeds: [new EmbedBuilder()
      .setColor("#ffdd00")
      .setTitle(`**► __${succ.name}__ ◄**`)
      .setAuthor({name: `${interaction.member.user.globalName} a débloqué un succès`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`})
      .setDescription(`> *${succ.desc}*`)
      .setThumbnail("https://i.imgur.com/4dGt5Aj.gif")
    ]})
  }, 500);
}

module.exports = { SendError, SendSucces };
