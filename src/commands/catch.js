const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js");
const {FindProfile,timeBetween,toHHMMSS,CheckSucces,CheckPerms,} = require("../controller/controller");
const { GetData, WriteData } = require("../controller/controllerData");
const { CatchPoke } = require("../controller/controllerPokemon");
const Profile = require("../profile");
const { DateTime } = require("luxon");
const combineImage = require("combine-image");
const { SendError } = require("../controller/controllerMessages");

module.exports = {
  data: catchs = new SlashCommandBuilder()
  .setName("catch")
  .setDescription("Attraper un pokémon"),

  async run(bot, interaction) {
    if (CheckPerms(interaction) == false) return;

    let listeProfiles = GetData("data");
    let player = FindProfile(bot, interaction.member.user.id);

    if (!player) {
      player = new Profile(interaction.member);
      listeProfiles.push(player);
    }
    if (
      timeBetween(
        new Date(
          DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })
        ),
        new Date(player.lastCatch)
      ) >= 1 //21600s = 6h
    ) {
      let pokemon = CatchPoke();
      player.inventory.push(pokemon.id);
      player.stats.totalCatch[pokemon.rarete.stat]++;
      player.stats.totalCatch.total++;
      player.money += 5;
      player.stats.totalMoney += 5;
      pokemon.type.forEach((type) => {
        player.type[type]++;
      });
      player.lastCatch = DateTime.now()
        .setZone("Europe/Paris")
        .toISO({ includeOffset: false });

        for (let i = 0; i < listeProfiles.length; i++) {
          if (listeProfiles[i].id == player.id) {
            listeProfiles[i] = player;
          }
        }
      
      listeProfiles = CheckSucces(bot,interaction,player,pokemon,listeProfiles);
      WriteData("data", listeProfiles);

      let listButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`sell/${interaction.member.user.id}/${pokemon.id}`)
          .setLabel(`🏷️ Vendre ce Pokémon`)
          .setStyle("Secondary"),
        )

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(pokemon.rarete.color)
            .setAuthor({
              name: interaction.member.user.globalName,
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`,
            })
            .setDescription(
              `**${player.displayName} a attrapé [__${pokemon.name}__](<https://www.pokepedia.fr/${pokemon.name}>) !** \n \nRareté : **${pokemon.rarete.rarity}** \n` +
                "`+5 💵`"
            )
            .setThumbnail(pokemon.img)
            .setFooter({
              text: `\u200b`,
              iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/770px-Pok%C3%A9_Ball_icon.svg.png`,
            })
            .setTimestamp(),
        ], components: [listButtons]
      });
    } else {SendError(`Action disponible dans : **${toHHMMSS(21600 - timeBetween(new Date(DateTime.now().setZone("Europe/Paris").toISO({ includeOffset: false })),new Date(player.lastCatch)))}**`,interaction)}
  },
};