const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const {
  FindProfile,
  getNumOfTimes,
  removeDuplicates,
  CheckPerms,
} = require("../../controller/controller");
const { GetData } = require("../../controller/controllerData");
const { FindRarity, findColor } = require("../../controller/controllerPokemon");
const { SendError } = require("../../controller/controllerMessages");

function sortPoke(array) {
  let pokemons = GetData("pokemons");
  let resultArrays = {
    god: [],
    fab: [],
    legend: [],
    ultBeast: [],
    standard: [],
  };

  array.forEach((pokeId) => {
    let pokemon = pokemons.find((pokemon) => pokemon.id == pokeId);
    resultArrays[FindRarity(pokemon).stat].push(pokemon);
  });

  let rarity = ["god", "fab", "legend", "ultBeast", "standard"];
  for (let i = 0; i < rarity.length; i++) {
    resultArrays[rarity[i]].sort(function (a, b) {
      if (a.name.french < b.name.french) {
        return -1;
      }
      if (a.name.french > b.name.french) {
        return 1;
      }
      return 0;
    });
  }

  return resultArrays.god.concat(
    resultArrays.fab,
    resultArrays.legend,
    resultArrays.ultBeast,
    resultArrays.standard
  );
}

function Inventaire(bot, interaction, page) {
  let player = FindProfile(interaction.member.id);

  let startRange = 25 * page - 25;
  let nbPokemon = getNumOfTimes(player.inventory);
  let endMsg = "";
  let pokeRarList = []

  let endArray = sortPoke(player.inventory)
  endArray = removeDuplicates(endArray);

  for (let p = startRange; p < endArray.length; p++) {
    if (p >= startRange + 25) break;
    endMsg += `${findColor(endArray[p])} [${endArray[p].name.french}](<https://www.pokepedia.fr/${endArray[p].name.french}>) (x ${nbPokemon[endArray[p].id]})\n`;
    pokeRarList.push({label: `${findColor(endArray[p])} ${endArray[p].name.french}`, value: endArray[p].id.toString()})
  }
  
  return {
    inventory: endMsg,
    page: page,
    pokemonsRarityList: pokeRarList
  };
}

function SendInventory(bot, interaction, page) {
  if (!CheckPerms(interaction)) return 
  let player = FindProfile( interaction.member.id);
  let totalPage = Math.ceil(removeDuplicates(player.inventory).length / 25);

  let listButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`arrow/${interaction.member.user.id}/l10/${page}`)
      .setLabel(`10 ⏪`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrow/${interaction.member.user.id}/l1/${page}`)
      .setLabel(`1 ◀️`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`close/${interaction.member.user.id}`)
      .setLabel("❌")
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrow/${interaction.member.user.id}/r1/${page}`)
      .setLabel(`▶️ 1`)
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId(`arrow/${interaction.member.user.id}/r10/${page}`)
      .setLabel(`⏩ 10`)
      .setStyle("Secondary")
  );

  let sellButtons = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
    .setCustomId(`sell/${interaction.member.user.id}`)
    .setPlaceholder(`🏷️ Vendre un Pokémon`)
    .setOptions(Inventaire(bot, interaction, 1).pokemonsRarityList)
  )

  let teamButtons = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
    .setCustomId(`team/${interaction.member.user.id}`)
    .setPlaceholder(`📥 Ajouter à l'équipe`)
    .setOptions(Inventaire(bot, interaction, 1).pokemonsRarityList)
  )

  if (player.inventory.length == 0) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#64c8c8")
          .setTitle(`Inventaire de ${interaction.member.user.displayName}`)
          .setDescription(`*Aucun pokémon*`)
          .setFooter({
            text: `0 / 0`,
            iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/770px-Pok%C3%A9_Ball_icon.svg.png`,
          }),
      ], fetchReply: true
    }).then(sent => {
      setTimeout(() => {
          sent.delete()
      }, 3000);
    });
    return;
  }

  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#64c8c8")
        .setTitle(`Inventaire de ${interaction.member.user.displayName}`)
        .setDescription(
          `**${player.inventory.length}** pokémons\n\n${
            Inventaire(bot, interaction, page).inventory
          }`
        )
        .setFooter({
          text: `${page} / ${totalPage}`,
          iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/770px-Pok%C3%A9_Ball_icon.svg.png`,
        }),
    ],
    components: [sellButtons, teamButtons, listButtons],
    fetchReply: true
  }).then(sent => {
    setTimeout(() => {
        sent.delete()
    }, 300000);
  });
}

function InventoryTurnPages(bot, interaction) {
  if (CheckPerms(interaction) == false) return;
  let arrow = interaction.customId.split("/")[2];
  let page = parseInt(interaction.customId.split("/")[3]);

  let player = FindProfile( interaction.member.id);
  let totalPage = Math.ceil(removeDuplicates(player.inventory).length / 25);

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
  UpdateInventory(bot, interaction, page, totalPage, player);
}

function UpdateInventory(bot, interaction, page, totalPage, player) {
  interaction.message.embeds[0].data.description = `**${player.inventory.length}** pokémons\n\n${Inventaire(bot, interaction, page).inventory}`;interaction.message.embeds[0].data.footer.text = `${Inventaire(bot, interaction, page).page} / ${totalPage}`;
  interaction.message.components[0].components[0].data.options = Inventaire(bot, interaction, page).pokemonsRarityList
  interaction.message.components[1].components[0].data.options = Inventaire(bot, interaction, page).pokemonsRarityList
  interaction.message.components[2].components[0].data.custom_id = `arrow/${interaction.member.user.id}/l10/${page}`;
  interaction.message.components[2].components[1].data.custom_id = `arrow/${interaction.member.user.id}/l1/${page}`;
  interaction.message.components[2].components[2].data.custom_id = `close/${interaction.member.user.id}`
  interaction.message.components[2].components[3].data.custom_id = `arrow/${interaction.member.user.id}/r1/${page}`;
  interaction.message.components[2].components[4].data.custom_id = `arrow/${interaction.member.user.id}/r10/${page}`;
 
  interaction.update({embeds: interaction.message.embeds,components: interaction.message.components});
}


module.exports = {
  sortPoke,
  Inventaire,
  SendInventory,
  InventoryTurnPages,
  UpdateInventory,
};
