import Game from './models/game.mjs';
import './example.json' with { type: 'json' };

const games = [];
onload = () => {
    loadLocal().forEach(game => {
        games.push(game);
    })
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