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

function SendNotError(message, interaction) {
  interaction.reply({
    embeds: [new EmbedBuilder().setDescription(message).setColor("Green")], fetchReply: true
  }).then(sent => {
    setTimeout(() => {
        sent.delete()
    }, 3000);
  });
}

function SendSucces(succ, interaction, bot) {
  let embed = {embeds: [new EmbedBuilder()
    .setColor("#ffdd00")
    .setTitle(`**► __${succ.name}__ ◄**`)
    .setAuthor({name: `${interaction.member.user.globalName} a débloqué un succès`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`})
    .setDescription(`> *${succ.desc}*`)
    .setThumbnail("https://i.imgur.com/4dGt5Aj.gif")
  ]}

  setTimeout(() => {
    if(interaction == undefined) {
      bot.channels.cache.get(process.env.TEST_CHAN).send(embed)
    }else{
      interaction.channel.send(embed)
    }
  }, 500);
}

function close(bot, interaction) {
  interaction.message.delete()
}

module.exports = { SendError, SendSucces, close, SendNotError };
