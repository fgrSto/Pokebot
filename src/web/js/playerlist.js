let response = await fetch('../../data/data.json')
let playerList = await response.json()
let playerBoard = document.querySelector(".playerBoard");

playerList.forEach(player => {
  let div = document.createElement('div');
  div.className = "boardElement";

  let joueur = document.createElement('h3');
  joueur.className = "name col colJoueur"
  joueur.textContent = player.displayName;

  let badgesDiv = document.createElement('div')
  badgesDiv.className = "badges col colBadges"

  player.badges.forEach(badge => {
    let imgContainer = document.createElement("div")
    imgContainer.className = "img-container"

    badgesDiv.appendChild(imgContainer)

    let badgeImg = document.createElement('img')
    badgeImg.src = "https://media.geeksforgeeks.org/wp-content/uploads/20240521235003/imagetag.png"
    badgeImg.alt = `Badge ${badge}`
    badgeImg.className = "imgBadge"

    imgContainer.appendChild(badgeImg)

    let overlay = document.createElement('b')
    overlay.className = "badgeName"
    overlay.innerHTML = badge

    imgContainer.appendChild(overlay)
  });

  div.appendChild(joueur);
  div.appendChild(badgesDiv)

  playerBoard.appendChild(div);
});
