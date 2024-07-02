const { GetData, GetPokemon } = require("./controllerData");

function Catch() {
  let pokemons = GetPokemon();
  let randomNumber = Math.floor(Math.random() * pokemons.length);
  return {
    name: pokemons[randomNumber].name.french,
    img: pokemons[randomNumber].hires,
    rarete: FindRarity(pokemons[randomNumber]),
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
      rarity: "Ultra chimère",
      price: 20,
    };
  } else if (rarete.SUB_LEGENDARY.includes(pokemon.id)) {
    return {
      rarity: "Sub Légendaire",
      price: 15,
    };
  } else if (rarete.LEGENDARY.includes(pokemon.id)) {
    return {
      rarity: "LÉGENDAIRE !",
      price: 25,
    };
  } else if (rarete.MYTHICAL.includes(pokemon.id)) {
    return {
      rarity: "MYTHIQUE !!",
      price: 35,
    };
  } else if (rarete.SPECIAL.includes(pokemon.id)) {
    return {
      rarity: "DIEU !!!",
      price: 50,
    };
  } else {
    return {
      rarity: "Standard",
      price: 10,
    };
  }
}

module.exports = { Catch };
