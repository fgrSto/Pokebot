const { GetData } = require("./controllerData");

function CatchPoke() {
  let pokemons = GetData("pokemons");
  let randomNumber = Math.floor(Math.random() * pokemons.length);
  return {
    id: pokemons[randomNumber].id,
    name: pokemons[randomNumber].name.french,
    img: pokemons[randomNumber].hires ? pokemons[randomNumber].hires : pokemons[randomNumber].thumbnail,
    rarete: FindRarity(pokemons[randomNumber]),
    type: pokemons[randomNumber].type,
  };
}

function FindRarity(pokemon) {
  let rarete = {
    ULTRA_BEAST: [
      793, 794, 795, 796, 797, 798, 799, 803, 804, 805,
      806,
    ],

    LEGENDARY: [
      144, 145, 146, 150, 243, 244, 245, 249, 250, 377,
      378, 379, 380, 381, 382, 383, 384, 483, 484, 485,
      486, 487, 488, 643, 644, 646, 716, 717, 718, 789,
      790, 791, 792, 800, 888, 889, 890, 898, 480, 481,
      482, 638, 639, 640, 641, 642, 645, 772, 773, 785,
      786, 787, 788, 803, 804, 805, 806, 891, 892, 894,
      895, 896, 897,
    ],

    FABULOUS: [
      151, 251, 385, 386, 489, 490, 491, 492, 494, 647,
      648, 649, 719, 720, 721, 801, 802, 807, 808, 809,
      893,
    ],

    SPECIAL: [
      493,
    ],
  };
  if (rarete.ULTRA_BEAST.includes(pokemon.id)) {
    return {
      stat: "ultBeast",
      rarity: "Ultra chimère",
      color: "#00ff64",
      price: 80,
      id: pokemon.id
    };
  } else if (rarete.LEGENDARY.includes(pokemon.id)) {
    return {
      stat: "legend",
      rarity: "LÉGENDAIRE !",
      color: "#ffff42",
      price: 25,
      id: pokemon.id
    };
  } else if (rarete.FABULOUS.includes(pokemon.id)) {
    return {
      stat: "fab",
      rarity: "FABULEUX !!",
      color: "#e100ff",
      price: 60,
      id: pokemon.id
    };
  } else if (rarete.SPECIAL.includes(pokemon.id)) {
    return {
      stat: "god",
      rarity: "DIEU !!!",
      color: "#ffbb00",
      price: 150,
      id: pokemon.id
    };
  } else {
    return {
      stat: "standard",
      rarity: "Standard",
      color: "#ffffff",
      price: 5,
      id: pokemon.id
    };
  }
}

function findColor(poke) {
  let color = ""
  switch (FindRarity(poke).stat) {
    case "god":
      color = `🟠`;
      break;

    case "fab":
      color = `🟣`;
      break;

    case "legend":
      color = `🟡`;
      break;

    case "ultBeast":
      color = `🟢`;
      break;

    case "standard":
      color = `⚪`;
      break;
  }
  return color
}

module.exports = { CatchPoke, FindRarity, findColor };