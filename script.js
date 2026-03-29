// GAME STATE
let game = {
    money: 1000000,
    reputation: 50,
    raceNumber: 1,
    riders: [],
    allRiders: [],
    standings: []
};

// SCREEN SWITCHING
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(screenId).classList.remove("hidden");
}

// CREATE RIDERS
function generateRiders() {
    const names = ["Jake", "Liam", "Noah", "Ethan", "Mason", "Lucas", "Logan"];
    
    for (let i = 0; i < 20; i++) {
        let rider = {
            name: names[Math.floor(Math.random() * names.length)] + " " + i,
            skill: Math.floor(Math.random() * 50) + 50,
            points: 0
        };
        game.allRiders.push(rider);
    }

    // Give player 2 riders
    game.riders = game.allRiders.slice(0, 2);
}

// DISPLAY TEAM
function updateTeam() {
    let div = document.getElementById("teamInfo");
    div.innerHTML = "";

    game.riders.forEach(r => {
        div.innerHTML += `<p>${r.name} | Skill: ${r.skill}</p>`;
    });
}

// DISPLAY MARKET
function updateMarket() {
    let div = document.getElementById("marketList");
    div.innerHTML = "";

    game.allRiders.forEach(r => {
        div.innerHTML += `
            <p>${r.name} (Skill: ${r.skill})
            <button onclick="signRider('${r.name}')">Sign</button></p>
        `;
    });
}

// SIGN RIDER
function signRider(name) {
    let rider = game.allRiders.find(r => r.name === name);
    game.riders.push(rider);
    updateTeam();
}

// RUN RACE
function runRace() {
    let results = [...game.allRiders];

    // Sort by skill + randomness
    results.sort((a, b) => {
        return (b.skill + Math.random() * 20) - (a.skill + Math.random() * 20);
    });

    let resultsDiv = document.getElementById("raceResults");
    let recapDiv = document.getElementById("raceRecap");

    resultsDiv.innerHTML = "<h3>Results</h3>";
    recapDiv.innerHTML = "<h3>Race Recap</h3>";

    results.forEach((r, index) => {
        if (index < 10) {
            r.points += [25,20,16,13,11,10,9,8,7,6][index];
        }

        resultsDiv.innerHTML += `<p>${index + 1}. ${r.name}</p>`;
    });

    // SIMPLE RECAP
    recapDiv.innerHTML += `<p>Race ${game.raceNumber} had intense battles and surprises!</p>`;

    game.raceNumber++;
    updateStandings();
}

// STANDINGS
function updateStandings() {
    let sorted = [...game.allRiders].sort((a, b) => b.points - a.points);

    let div = document.getElementById("standingsList");
    div.innerHTML = "";

    sorted.forEach(r => {
        div.innerHTML += `<p>${r.name} - ${r.points} pts</p>`;
    });
}

// INIT GAME
generateRiders();
updateTeam();
updateMarket();
updateStandings();
