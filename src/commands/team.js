const { SlashCommandBuilder, Client } = require("discord.js");

module.exports = {

    data: team = new SlashCommandBuilder()
    .setName("team")
    .setDescription("Afficher ou modifier l'équipe")
    .addStringOption(option => 
        option.setName("add")
        .setDescription("Ajouter un pokémon à l'équipe")
        .setRequired(false)
        .setAutocomplete(true))
    .addStringOption(option => 
        option.setName("remove")
        .setDescription("Retire un pokémon de l'équipe")
        .setRequired(false)
        .setAutocomplete(true),)
    .addStringOption(option =>
        option.setName("see")
        .setDescription("Voir l'équipe d'un joueur")
        .setRequired(false)),
        
    async run(bot, interaction) {
        
    }
    
}
    




// module.exports = {
//     name: "team",
//     description: "Afficher ou modifier l'équipe",
//     options: [
//         {
//             name: "add",
//             description: "Ajouter un pokémon à l'équipe",
//             required: false,
//             type: "String",
//             autocomplete: true
//         },
//         {
//             name: "remove",
//             description: "Retirer un pokémon de l'équipe",
//             required: false,
//             type: "String",
//             autocomplete: true
//         },
//         {
//             name: "see",
//             description: "Voir l'équipe d'un joueur",
//             required: false,
//             type: "User",
//         },
//     ],


// }