const fs = require("fs");
const path = require("path");

module.exports = async (bot) => {
  fs.readdirSync(`${path.join(__dirname, "..")}/commands`)
    .filter((f) => f.endsWith(".js"))
    .forEach(async (file) => {
      let command = require(`../commands/${file}`);
      if (!command.name || typeof command.name !== "string") {
        return;
      } else {
        bot.commands.set(command.name, command);
      }
    });

  /*fs.readdirSync(`${path.join(__dirname, "..")}/commands/events/test`).filter(f => f.endsWith(".js")).forEach(async file => {

    let command = require(`../commands/events/test/${file}`)
    if(!command.name || typeof command.name !== "string") {
      return
    }else{
      bot.commands.set(command.name, command)
    }
  })*/
};
