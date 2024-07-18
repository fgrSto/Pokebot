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
    ULTRA_BEAST: [793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806], //rare

    SUB_LEGENDARY: [
      144, 145, 146, 243, 244, 245, 377, 378, 379, 380, 381, 480, 481, 482, 485,
      486, 488, 638, 639, 640, 641, 642, 645, 772, 773, 785, 786, 787, 788, 803,
      804, 805, 806, 891, 892, 894, 895, 896, 897,
    ],

    LEGENDARY: [
      150, 249, 250, 382, 383, 384, 483, 484, 487, 643, 644, 646, 716, 717, 718,
      789, 790, 791, 792, 800, 888, 889, 890, 898,
    ],

    MYTHICAL: [
      151, 251, 385, 386, 489, 490, 491, 492, 494, 647, 648, 649, 719, 720, 721,
      801, 802, 807, 808, 809, 893,
    ],

    SPECIAL: [493], //epic
  };
  if (rarete.ULTRA_BEAST.includes(pokemon.id)) {
    return {
      stat: "ultBeast",
      rarity: "Ultra chimère",
      color: "#00ff64",
      price: 20,
      id: pokemon.id
    };
  } else if (rarete.SUB_LEGENDARY.includes(pokemon.id)) {
    return {
      stat: "subLeg",
      rarity: "Sub Légendaire",
      color: "#003cff",
      price: 15,
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
  } else if (rarete.MYTHICAL.includes(pokemon.id)) {
    return {
      stat: "myth",
      rarity: "MYTHIQUE !!",
      color: "#e100ff",
      price: 35,
      id: pokemon.id
    };
  } else if (rarete.SPECIAL.includes(pokemon.id)) {
    return {
      stat: "god",
      rarity: "DIEU !!!",
      color: "#ffbb00",
      price: 50,
      id: pokemon.id
    };
  } else {
    return {
      stat: "standard",
      rarity: "Standard",
      color: "#ffffff",
      price: 10,
      id: pokemon.id
    };
  }
}

module.exports = { CatchPoke, FindRarity };
