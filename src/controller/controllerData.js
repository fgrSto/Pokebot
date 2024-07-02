let fs = require("fs");

function GetData() {
  JSON.parse(fs.readFileSync(`${(__dirname, "./")}/data/data.json`));
}

function GetPokemon() {
  JSON.parse(fs.readFileSync(`${(__dirname, "./")}/data/pokemons.json`));
}

module.exports = { GetData, GetPokemon };
