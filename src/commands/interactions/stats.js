const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { FindProfile } = require("../../controller/controller");

function ShowStats(bot, interaction) {
    let player = FindProfile(bot, interaction.member.id);

    let listButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`close/${interaction.member.user.id}`)
            .setLabel("❌")
            .setStyle("Secondary"),
    )

    interaction.reply({
        embeds: [
            new EmbedBuilder()
            
        ]
    })
}

module.exports = { ShowStats }