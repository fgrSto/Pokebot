const { EmbedBuilder } = require("discord.js");
const { CheckPerms, FindProfile } = require("../../controller/controller");
const { GetData, WriteData } = require("../../controller/controllerData");
const { FindRarity } = require("../../controller/controllerPokemon");
const { SendError } = require("../../controller/controllerMessages");

function SellPokemon(bot, interaction) {
    if (!CheckPerms(interaction)) return

    let pokemon = interaction.customId.split("/")[2] ? interaction.customId.split("/")[2] : interaction.values[0]
    let pokemons = GetData("pokemons").find(poke => poke.id == pokemon)
    let player = FindProfile( interaction.customId.split("/")[1])
    let listeProfiles = GetData("data");
    let price = FindRarity(pokemons).price
    if(!player) return SendError("PTDR T KI", interaction)

    let index = player.inventory.indexOf(parseInt(pokemon))
    if (index > -1) {
        player.inventory.splice(index, 1)
        player.money += price
        player.stats.totalMoney += price
    } else {
        SendError(`Pokémon déjà vendu`, interaction)
        return
    }


    for (let i = 0; i < listeProfiles.length; i++) {
        if (listeProfiles[i].id == player.id) {
          listeProfiles[i] = player;
        }
      }
    WriteData("data", listeProfiles);


    interaction.reply({embeds: [new EmbedBuilder()
        .setColor(`#FCD53F`)
        .setAuthor({
          name: interaction.member.user.globalName,
          iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`,
        })
        .setDescription(
          `**${player.displayName} a vendu un [__${pokemons.name.french}__](<https://www.pokepedia.fr/${pokemons.name.french}>) !**\n \n*Il lui rapporte* ` + "`" + price + " 💵`" 
        )
        .setThumbnail(pokemons.hires ? pokemons.hires : pokemons.thumbnail)
        .setFooter({
          text: `\u200b`,
          iconURL: `https://static-00.iconduck.com/assets.00/label-emoji-2048x1768-yvo1vpgs.png`,
        })
        .setTimestamp(),
    ]})
}
module.exports = {SellPokemon}