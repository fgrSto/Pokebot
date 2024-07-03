const { EmbedBuilder } = require("discord.js");
const {
  FindProfile,
  timeBetween,
  toHHMMSS,
} = require("../controller/controller");
const { GetData, WriteData } = require("../controller/controllerData");
const { Catch } = require("../controller/controllerPokemon");
const Profile = require("../profile");
const { DateTime } = require("luxon");
const { SendError } = require("../controller/controllerMessages");

module.exports = {
  name: "catch",
  description: "Permet d'attraper un pokémon",

  async run(bot, interaction) {
    let listeProfiles = GetData("data");
    let player = FindProfile(bot, interaction);

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
      ) >= 21600 //21600s = 6h
    ) {
      let pokemon = Catch();
      player.inventory.push(pokemon.id);
      player.stats.totalCatch[pokemon.rarete.stat]++;
      player.stats.totalCatch.total++;
      player.money += 5;
      player.stats.totalMoney += 5;
      player.lastCatch = DateTime.now()
        .setZone("Europe/Paris")
        .toISO({ includeOffset: false });

      for (let i = 0; i < listeProfiles.length; i++) {
        if (listeProfiles[i].id == player.id) {
          listeProfiles[i] = player;
        }
      }

      WriteData("data", listeProfiles);
      interaction.reply({embeds: [new EmbedBuilder()
        .setColor(pokemon.rarete.color)
        .setTitle(`${player.displayName} a attrapé __${pokemon.name}__ !`)
        .setAuthor({name: interaction.member.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`})
        .setDescription(`Rareté : **${pokemon.rarete.rarity}** \n` + "`+5 💵`")
        .setThumbnail(pokemon.img)
        .setFooter({text: `\u200b`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/770px-Pok%C3%A9_Ball_icon.svg.png`})
        .setTimestamp()
      ]})
    } else {
      SendError(
        `Action disponible dans : **${toHHMMSS(
          21600 -
            timeBetween(
              new Date(
                DateTime.now()
                  .setZone("Europe/Paris")
                  .toISO({ includeOffset: false })
              ),
              new Date(player.lastCatch)
            )
        )}**`,
        interaction
      );
    }
  },
};
