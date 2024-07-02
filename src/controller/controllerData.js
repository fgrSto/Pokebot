let fs = require("fs");
const path = require("path");

function GetData(file) {
  return JSON.parse(
    fs.readFileSync(`${(__dirname, "./")}/data/${file}.json`, "utf8")
  );
}

function WriteData(file, data) {
  fs.writeFileSync(
    `${path.join(__dirname, "../../")}/data/${file}.json`,
    JSON.stringify(data),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
}

module.exports = { GetData, WriteData };
