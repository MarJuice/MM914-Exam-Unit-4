import Game from './models/game.mjs';
import './example.json' with { type: 'json' };

const games = [];
onload = () => {
    games.push(loadLocal());
    displayGames();
}

function saveLocal(game) {
    new Game(
        game.title,
        game.designer,
        game.artist,
        game.publisher,
        game.year,
        game.players,
        game.time,
        game.difficulty,
        game.url,
        game.playCount,
        game.personalRating
    );
    localStorage.setItem(game.title, JSON.stringify(game));
    displayGames();
}

function loadLocal() {
    let games = Object.keys(localStorage).map(key => {
        return JSON.parse(localStorage.getItem(key));
    });
    return games;
}

function listGamesJSON() {
    let games = loadLocal();
    return JSON.stringify(games, null, 2)
}

function importGamesJSON(data) {
    JSON.parse(data).forEach(game => {
        saveLocal(game);
        });
}

document.getElementById('importSource').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log(e.target.result);
            importGamesJSON(e.target.result);
        };
        reader.readAsText(file);
    }
});

function displayGames() {
    const localGames = loadLocal();
    const gamesContainer = document.getElementById('gamesDisplay');
    gamesContainer.innerHTML = '';

    localGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game-entry';
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
            <p>Year: ${game.year} Players: ${game.players} Time: ${game.time} Difficulty: ${game.difficulty}</p>
            <br>
            <p>Designer: ${game.designer}</p>
            <p>Artist: ${game.artist}</p>
            <p>Publisher: ${game.publisher}</p>
            <p>BGG Listing: <a href="${game.url}" target="_blank">${game.url}</a></p>
            <br>
            <p>Play Count: ${game.playCount} <button id="playCountIncrement">+</button></p>
            <p>Personal Rating: <input type="range">${game.personalRating}</input></p>
        `;
        gamesContainer.appendChild(gameElement);
    })
}