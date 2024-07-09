const { FindProfile, getNumOfTimes, removeDuplicates } = require("../../controller/controller");
const { GetData } = require("../../controller/controllerData");
const { FindRarity } = require("../../controller/controllerPokemon");

function Inventaire(bot, interaction) {
  let player = FindProfile(bot, interaction.member.id)
  let pokemons = GetData("pokemons");
  let resultArrays = {god: [], ultBeast: [], myth: [], legend: [], subLeg: [], standard: []}

  player.inventory.forEach(pokeId => {
    let pokemon = pokemons.find(pokemon => pokemon.id == pokeId)
    resultArrays[FindRarity(pokemon).stat].push(pokemon)
  });
  
  let rarity = ["god", "ultBeast", "myth", "legend", "subLeg", "standard"]
  for (let i = 0; i < rarity.length; i++) {
    resultArrays[rarity[i]].sort(function (a,b) {
      if(a.name.french < b.name.french) {
        return -1
      }
      if(a.name.french > b.name.french) {
        return 1
      }
      return 0
    })
  }

  let endArray = resultArrays.god.concat(resultArrays.ultBeast, resultArrays.myth, resultArrays.legend, resultArrays.subLeg, resultArrays.standard)
  let page = interaction.customId.split("/")[2]
  let startRange = (30 * page) - 30
  let nbPokemon = getNumOfTimes(player.inventory)
  let endMsg = ""


  endArray = removeDuplicates(endArray)
  
  for (let p = startRange; p < endArray.length ; p++) {
    if(p >= startRange + 30) break
    switch (FindRarity(endArray[p]).stat) {
      case "god":
        endMsg += `🟠 `
        break;

      case "ultBeast":
        endMsg += `🟢 `
        break

      case "myth":
        endMsg += `🟣 `
        break

      case "legend":
        endMsg += `🔵 `
        break

      case "subLeg":
        endMsg += `🟡 `
        break

      case "standard":
        endMsg += `⚪ `
        break
    }
    endMsg += `[${endArray[p].name.french}](<https://www.pokepedia.fr/${endArray[p].name.french}>) (x ${nbPokemon[endArray[p].id]})\n`
  }
  console.log(endMsg);
}

module.exports = { Inventaire };