const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { FindProfile, CheckPerms } = require("../../controller/controller");
const { SendError } = require("../../controller/controllerMessages");
const { Succes } = require("../../succes");
const { Bagdes } = require("../../badges");

function ShowSucces(bot, interaction, page) {
  let player = FindProfile(bot, interaction.member.id);
  let startRange = 10 * page - 20;
  let succesMsg = "";
  let badgesMsg = "";
  let listsucces = Succes(player, 0);

  if (page != 1) {
    for (let i = startRange; i < listsucces.length; i++) {
      if (i >= startRange + 10) break;
      if (player.succes.includes(listsucces[i].id)) {
        succesMsg += `✅ **__${listsucces[i].name}__** \n ||*${listsucces[i].desc}*|| \n \n`;
      } else {
        succesMsg += `🔒 **__${listsucces[i].name}__** \n ||*${listsucces[i].desc}*|| \n \n`;
      }
    }
  } else {
    let badges = Bagdes(player);

    for (let i = 0; i < badges.length; i++) {
      badgesMsg += `${badges[i].icon} **__${badges[i].name}__** \n ||*${badges[i].desc}*|| \n \n`;
    }
  }

  return {
    badges: badgesMsg,
    succes: succesMsg,
    page: page,
  };
}

function SuccesSend(bot, interaction, page) {
  let player = FindProfile(bot, interaction.member.id);
  let totalPage = Math.ceil(Succes(player, 0).length / 10) + 1;

  let listButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`arrowSucces/${interaction.member.user.id}/l10/${page}`)
      .setLabel(`10 ⏪`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrowSucces/${interaction.member.user.id}/l1/${page}`)
      .setLabel(`1 ◀️`)
      .setStyle("Secondary"),
      new ButtonBuilder()
      .setCustomId(`close/${interaction.member.user.id}`)
      .setLabel("❌")
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrowSucces/${interaction.member.user.id}/r1/${page}`)
      .setLabel(`▶️ 1`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrowSucces/${interaction.member.user.id}/r10/${page}`)
      .setLabel(`⏩ 10`)
      .setStyle("Secondary")
  );

  if (page == 1) {
    let badgesMsg = ShowSucces(bot, interaction, page).badges

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#ffff00")
          .setTitle(`Badges de ${interaction.member.user.displayName}`)
          .setDescription(`Les badges sont des accomplissements affichés sur le profile \nIls sont uniques ou particulièrements difficiles à obtenir \n \n${badgesMsg}`)
          .setFooter({
            text: `${page} / ${totalPage}`,
            iconURL: `https://www.pngall.com/wp-content/uploads/5/Gold-Trophy-PNG.png`,
          }),
      ],
      components: [listButtons],
    });
  } else {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#ffff00")
          .setTitle(`Succès de ${interaction.member.user.displayName}`)
          .setDescription(ShowSucces(bot, interaction, page).succes)
          .setFooter({
            text: `${page} / ${totalPage}`,
            iconURL: `https://www.pngall.com/wp-content/uploads/5/Gold-Trophy-PNG.png`,
          }),
      ],
      components: [listButtons],
    });
  }
}

function SuccesTurnPages(bot, interaction) {
  if (CheckPerms(interaction) == false) return;
  let arrow = interaction.customId.split("/")[2];
  let page = parseInt(interaction.customId.split("/")[3]);

  let player = FindProfile(bot, interaction.member.id);
  let totalPage = Math.ceil(Succes(player, 0).length / 10) + 1;

  switch (arrow) {
    case "l10":
      if (page == 1) return SendError("Il n'y plus de pages", interaction);
      if (page - 10 <= 0) {
        page = 1;
      } else {
        page -= 10;
      }
      break;
    case "l1":
      if (page - 1 <= 0) return SendError("Il n'y plus de pages", interaction);
      page -= 1;
      break;
    case "r1":
      if (page + 1 > totalPage)
        return SendError("Il n'y plus de pages", interaction);
      page += 1;
      break;
    case "r10":
      if (page == totalPage)
        return SendError("Il n'y plus de pages", interaction);
      if (page + 10 > totalPage) {
        page = totalPage;
      } else {
        page += 10;
      }
      break;
  }
  UpdateSucces(bot, interaction, page, totalPage);
}

function UpdateSucces(bot, interaction, page, totalPage) {
  interaction.message.embeds[0].data.title = page == 1 ? `Badges de ${interaction.member.user.displayName}` : `Succès de ${interaction.member.user.displayName}`;
  interaction.message.embeds[0].data.description = page == 1 ? `${ShowSucces(bot, interaction, page).badges}` : `${ShowSucces(bot, interaction, page).succes}`;
  interaction.message.embeds[0].data.footer.text = `${ShowSucces(bot, interaction, page).page} / ${totalPage}`;
  interaction.message.components[0].components[0].data.custom_id = `arrowSucces/${interaction.member.user.id}/l10/${page}`;
  interaction.message.components[0].components[1].data.custom_id = `arrowSucces/${interaction.member.user.id}/l1/${page}`;
  interaction.message.components[0].components[2].data.custom_id = `close/${interaction.member.user.id}`
  interaction.message.components[0].components[3].data.custom_id = `arrowSucces/${interaction.member.user.id}/r1/${page}`;
  interaction.message.components[0].components[4].data.custom_id = `arrowSucces/${interaction.member.user.id}/r10/${page}`;
  interaction.update({
    embeds: interaction.message.embeds,
    components: interaction.message.components,
  });
}

module.exports = { ShowSucces, SuccesSend, SuccesTurnPages, UpdateSucces };
