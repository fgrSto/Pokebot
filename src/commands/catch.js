const { EmbedBuilder } = require("discord.js");
const {
  FindProfile,
  timeBetween,
  toHHMMSS,
  CheckSucces,
} = require("../controller/controller");
const { GetData, WriteData } = require("../controller/controllerData");
const { Catch } = require("../controller/controllerPokemon");
const Profile = require("../profile");
const { DateTime } = require("luxon");
const combineImage = require('combine-image')
const { SendError } = require("../controller/controllerMessages");

module.exports = {
  name: "catch",
  description: "Permet d'attraper un pokémon",

  async run(bot, interaction) {
    let listeProfiles = GetData("data");
    let player = FindProfile(bot, interaction);

    // interaction.deferReply()

    // let imgPoke = ["https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/001.png", "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/002.png", "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/003.png", "https://i.pinimg.com/originals/2b/46/73/2b4673e318ab94da17bbf9eaad5b80d6.png", "https://i.pinimg.com/originals/2b/46/73/2b4673e318ab94da17bbf9eaad5b80d6.png", "https://i.pinimg.com/originals/2b/46/73/2b4673e318ab94da17bbf9eaad5b80d6.png"]

    // combineImage(imgPoke).then((image) => {
    //   image.write('team.png',  () => {
    //     setTimeout(() => {
    //         interaction.editReply({embeds: [new EmbedBuilder()
    //           .setTitle("Profile de X")
    //           .setImage("attachment://team.png")
    //         ]
    //         ,files: [
    //           `team.png`
    //         ]
    //       });
    //     }, 2000);
    //   })
    // })
    
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
      let pokemon = Catch();
      player.inventory.push(pokemon.id);
      player.stats.totalCatch[pokemon.rarete.stat]++;
      player.stats.totalCatch.total++;
      player.money += 5;
      player.stats.totalMoney += 5;
      pokemon.type.forEach(type => {
        player.type[type]++
      });
      player.lastCatch = DateTime.now()
        .setZone("Europe/Paris")
        .toISO({ includeOffset: false });

      player = CheckSucces(bot, interaction, player, pokemon)
        
      for (let i = 0; i < listeProfiles.length; i++) {
        if (listeProfiles[i].id == player.id) {
          listeProfiles[i] = player;
        }
      }
      WriteData("data", listeProfiles);


      interaction.reply({embeds: [new EmbedBuilder()
        .setColor(pokemon.rarete.color)
        .setAuthor({name: interaction.member.user.globalName, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`})
        .setDescription(`**${player.displayName} a attrapé [__${pokemon.name}__](<https://www.pokepedia.fr/${pokemon.name}>) !** \n \nRareté : **${pokemon.rarete.rarity}** \n` + "`+5 💵`")
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
