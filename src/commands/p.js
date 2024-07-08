const { FindProfile, SendProfile} = require("../controller/controller");
const { GetData, WriteData } = require("../controller/controllerData");
const { SendError } = require("../controller/controllerMessages");
const Profile = require("../profile");
const combineImage = require("combine-image");

module.exports = {
  name: "p",
  description: "Voir le profil d'un joueur",
  options: [
    {
      name: "user",
      description: "Voir le profil d'un autre joueur",
      required: false,
      type: "User",
    },
  ],
  async run(bot, interaction) {
    let listeProfiles = GetData("data");
    let player = null;
    if (interaction.options._hoistedOptions[0]) {
      player = FindProfile(bot, interaction.options._hoistedOptions[0]);
      if (!player) {
        SendError("**Joueur introuvable**", interaction);
      }
    } else {
      player = FindProfile(bot, interaction.member);
      if (!player) {
        player = new Profile(interaction.member);
        listeProfiles.push(player);

        for (let i = 0; i < listeProfiles.length; i++) {
          if (listeProfiles[i].id == player.id) {
            listeProfiles[i] = player;
          }
        }

        WriteData("data", listeProfiles);
      }
    }
    
    interaction.deferReply()

    setTimeout(() => {
        let photos = []
        for (let i = 0; i < 6; i++) {
            if (player.team[i]) {
                photos.push(GetData("pokemons").find(pokemon => pokemon.id == player.team[i]).hires ? GetData("pokemons").find(pokemon => pokemon.id == player.team[i]).hires : GetData("pokemons").find(pokemon => pokemon.id == player.team[i]).thumbnail)
            } else {
                photos.push("https://i.imgur.com/9OIW87s.png")
            }
        }
        combineImage(photos).then((image) => {
            image.write('team.png',  () => {
                SendProfile(player, interaction)
            })
        })
    }, 700);
    },
};