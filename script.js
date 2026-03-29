// =======================
// PODIUM MX MASTER 26 - FULL JS
// =======================

// =======================
// GAME STATE
// =======================
let game = {
    money: 1000000,
    reputation: 50,
    raceNumber: 1,
    seasonRaces: 12,
    tracks: [],
    playerTeam: {
        name: "Your Team",
        riders: [],
        bike: { engine: 50, suspension: 50, tires: 50 },
        staff: { engineers: 1, scouts: 1, PR: 1 }
    },
    aiTeams: [],
    allRiders: [],
    sponsors: [],
    news: []
};

// =======================
// CLASSES
// =======================
class Rider {
    constructor(name) {
        this.name = name;
        this.skill = Math.floor(Math.random() * 50) + 50; // 50-100
        this.reputation = Math.floor(Math.random() * 50) + 50;
        this.traits = this.generateTraits();
        this.points = 0;
        this.contract = null;
        this.injured = false;
        this.retired = false;
        this.sweetSpot = this.generateSweetSpot();
    }

    generateTraits() {
        const traitPool = ["Aggressive", "Consistent", "Clutch", "Popular"];
        return traitPool[Math.floor(Math.random() * traitPool.length)];
    }

    generateSweetSpot() {
        return {
            salary: Math.floor(Math.random() * 50000) + 50000,
            contractLength: Math.floor(Math.random() * 3) + 1,
            bonus: Math.floor(Math.random() * 20000)
        };
    }
}

class Contract {
    constructor(salary, length, bonus, deadline) {
        this.salary = salary;
        this.length = length;
        this.bonus = bonus;
        this.deadline = deadline;
        this.riskClause = Math.random() < 0.2;
    }
}

class Track {
    constructor(name, type, difficulty) {
        this.name = name;
        this.type = type; // Mud, Sand, Hardpack
        this.difficulty = difficulty; // 1-3
    }
}

class Sponsor {
    constructor(name, objective, payout) {
        this.name = name;
        this.objective = objective;
        this.payout = payout;
        this.active = true;
    }
}

// =======================
// GENERATE ENTITIES
// =======================
function generateTracks() {
    const types = ["Mud", "Sand", "Hardpack"];
    for (let i = 0; i < game.seasonRaces; i++) {
        game.tracks.push(new Track("Track " + (i + 1), types[Math.floor(Math.random() * types.length)], Math.floor(Math.random() * 3) + 1));
    }
}

function generateRiders() {
    const names = ["Jake", "Liam", "Noah", "Ethan", "Mason", "Lucas", "Logan", "Aiden", "Carter", "Oliver"];
    for (let i = 0; i < 20; i++) {
        game.allRiders.push(new Rider(names[Math.floor(Math.random() * names.length)] + " " + i));
    }
    game.playerTeam.riders = game.allRiders.slice(0, 3);
}

function generateAITeams() {
    const teamNames = ["Red Hawks", "Blue Titans", "Iron Wolves"];
    teamNames.forEach(name => {
        let team = {
            name: name,
            riders: [],
            bike: { engine: 50, suspension: 50, tires: 50 },
            staff: { engineers: 1, scouts: 1, PR: 1 },
            boardObjective: Math.random() < 0.5 ? "Top5" : "Top10"
        };
        team.riders = game.allRiders.slice(Math.floor(Math.random() * 5) + 3, Math.floor(Math.random() * 5) + 8);
        game.aiTeams.push(team);
    });
}

function generateSponsors() {
    const sponsorNames = ["Monster Energy", "Red Bull", "GoPro", "Yamaha"];
    sponsorNames.forEach(name => {
        game.sponsors.push(new Sponsor(name, "Finish Top 5", Math.floor(Math.random() * 50000) + 50000));
    });
}

// =======================
// UI FUNCTIONS
// =======================
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
    highlightTab(screenId);
}

function highlightTab(screenId) {
    document.querySelectorAll("#tabs button").forEach(b => b.classList.remove("active"));
    let tabMap = { mainScreen: "tabMain", teamScreen: "tabTeam", marketScreen: "tabMarket", raceScreen: "tabRace", standingsScreen: "tabStandings" };
    if (tabMap[screenId]) document.getElementById(tabMap[screenId]).classList.add("active");
}

function updateTeam() {
    let div = document.getElementById("teamInfo");
    div.innerHTML = "";
    game.playerTeam.riders.forEach(r => {
        div.innerHTML += `<p>${r.name} | Skill: ${r.skill} | ${r.traits} ${r.injured ? "(Injured)" : ""}</p>`;
    });
}

function updateMarket() {
    let div = document.getElementById("marketList");
    div.innerHTML = "";
    game.allRiders.forEach(r => {
        if (!game.playerTeam.riders.includes(r) && !r.retired) {
            div.innerHTML += `<p>${r.name} (Skill: ${r.skill}) <button onclick="showContract('${r.name}')">Propose Contract</button></p>`;
        }
    });
}

function updateStandings() {
    let sorted = [...game.allRiders].sort((a, b) => b.points - a.points);
    let div = document.getElementById("standingsList");
    div.innerHTML = "";
    sorted.forEach((r, i) => div.innerHTML += `<p>${i + 1}. ${r.name} - ${r.points} pts</p>`);
}

function updateNews(msg) {
    game.news.unshift(msg);
    let div = document.getElementById("news");
    div.innerHTML = game.news.slice(0, 5).map(n => `<p>${n}</p>`).join("");
}

// =======================
// CONTRACT SYSTEM
// =======================
function showContract(riderName) {
    let rider = game.allRiders.find(r => r.name === riderName);
    let div = document.getElementById("marketList");
    div.innerHTML = `<p>Propose Contract to ${rider.name}</p>
        Salary: <input type="number" id="salary" value="${rider.sweetSpot.salary}"><br>
        Length: <input type="number" id="length" value="${rider.sweetSpot.contractLength}"><br>
        Bonus: <input type="number" id="bonus" value="${rider.sweetSpot.bonus}"><br>
        <button onclick="proposeContract('${rider.name}')">Propose</button>
    `;
}

function proposeContract(riderName) {
    let rider = game.allRiders.find(r => r.name === riderName);
    let salary = parseInt(document.getElementById("salary").value);
    let length = parseInt(document.getElementById("length").value);
    let bonus = parseInt(document.getElementById("bonus").value);

    let chance = 50;
    chance += 50 - Math.abs(rider.sweetSpot.salary - salary) / 1000;
    chance += 10 - Math.abs(rider.sweetSpot.contractLength - length) * 5;
    chance += 10 - Math.abs(rider.sweetSpot.bonus - bonus) / 2000;
    chance += (game.reputation - 50) / 5;
    chance = Math.min(Math.max(chance, 5), 95);

    if (Math.random() * 100 < chance) {
        game.playerTeam.riders.push(rider);
        updateTeam();
        updateMarket();
        updateNews(`${rider.name} has joined your team!`);
    } else {
        updateNews(`${rider.name} rejected your offer.`);
    }
    updateMarket();
}

// =======================
// AI TEAM ACTIONS
// =======================
function aiSignRiders() {
    game.aiTeams.forEach(team => {
        game.allRiders.forEach(rider => {
            if (!team.riders.includes(rider) && !rider.retired) {
                let chance = 30 + Math.random() * 50 + (team.boardObjective === "Top5" ? 10 : 0);
                if (Math.random() * 100 < chance) {
                    team.riders.push(rider);
                    updateNews(`${team.name} signed ${rider.name} (AI team)`);
                }
            }
        });
    });
}

// =======================
// UPGRADES
// =======================
function upgradeBike(player = true) {
    let team = player ? game.playerTeam : game.aiTeams[Math.floor(Math.random() * game.aiTeams.length)];
    team.bike.engine += Math.floor(Math.random() * 5);
    team.bike.suspension += Math.floor(Math.random() * 5);
    team.bike.tires += Math.floor(Math.random() * 5);
    updateNews(`${team.name}'s bike upgraded!`);
}

function hireStaff(player = true) {
    let team = player ? game.playerTeam : game.aiTeams[Math.floor(Math.random() * game.aiTeams.length)];
    team.staff.engineers += 1;
    updateNews(`${team.name} hired an engineer!`);
}

// =======================
// RANDOM EVENTS
// =======================
function triggerRandomEvent(riders) {
    const events = [
        { desc: "Heavy rain affected the track!", effect: riders => riders.forEach(r => r.skill -= Math.floor(Math.random() * 5)) },
        { desc: "A rider had a minor injury.", effect: riders => { let r = riders[Math.floor(Math.random() * riders.length)]; r.injured = true; } },
        { desc: "Media scandal boosts popularity.", effect: () => { game.reputation += 5; } }
    ];
    if (Math.random() < 0.3) {
        let ev = events[Math.floor(Math.random() * events.length)];
        ev.effect(riders);
        updateNews(ev.desc);
    }
}

// =======================
// SPONSOR PAYOUTS & BOARD CHECK
// =======================
function processSponsorPayouts() {
    game.sponsors.forEach(s => {
        if (s.active) {
            let topRiders = [...game.playerTeam.riders].sort((a, b) => b.points - a.points).slice(0, 1);
            if (topRiders.length > 0 && topRiders[0].points >= 50) {
                game.money += s.payout;
                updateNews(`${s.name} paid you $${s.payout} for meeting objectives!`);
            } else {
                updateNews(`${s.name} withheld payment.`);
            }
        }
    });
}

function boardApprovalCheck() {
    let threshold = game.seasonRaces * 10;
    let totalPoints = game.playerTeam.riders.reduce((a, b) => a + b.points, 0);
    if (totalPoints < threshold) {
        game.money -= 50000;
        updateNews("Board displeased! Budget reduced.");
    }
}

// =======================
// RACE ENGINE
// =======================
function runRace() {
    const track = game.tracks[(game.raceNumber - 1) % game.tracks.length];
    let results = [];
    let raceRiders = [...game.playerTeam.riders];
    game.aiTeams.forEach(team => raceRiders.push(...team.riders));
    raceRiders = raceRiders.filter(r => !r.retired && (!r.injured || Math.random() < 0.8));

    raceRiders.forEach(r => {
        let bikeBonus = game.playerTeam.riders.includes(r) ? game.playerTeam.bike : { engine: 50, suspension: 50, tires: 50 };
        let perf = r.skill + bikeBonus.engine * 0.3 + bikeBonus.suspension * 0.2 + bikeBonus.tires * 0.2;
        if (r.traits === "Aggressive") perf += Math.random() * 10;
        if (r.traits === "Consistent") perf += Math.random() * 5;
        if (r.traits === "Clutch") perf += (Math.random() < 0.3 ? 10 : 0);
        perf -= track.difficulty * 5;
        if (Math.random() < 0.05 * track.difficulty) r.injured = true;
        results.push({ rider: r, perf: perf });
    });

    results.sort((a, b) => b.perf - a.perf);

    let resultsDiv = document.getElementById("raceResults");
    let recapDiv = document.getElementById("raceRecap");
    resultsDiv.innerHTML = "<h3>Results</h3>";
    recapDiv.innerHTML = `<h3>Race Recap - ${track.name} (${track.type})</h3>`;

    results.forEach((res, index) => {
        let pointsAwarded = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6][index] || 0;
        res.rider.points += pointsAwarded;
        resultsDiv.innerHTML += `<p>${index + 1}. ${res.rider.name} - ${pointsAwarded} pts ${res.rider.injured ? "(Injured!)" : ""}</p>`;
        recapDiv.innerHTML += `<p>${res.rider.name} ${res.rider.injured ? "(Injured!)" : ""} performed with skill ${res.rider.skill} and bike bonuses (E:${bikeBonus.engine}, S:${bikeBonus.suspension}, T:${bikeBonus.tires})</p>`;
    });

    triggerRandomEvent(raceRiders);
    aiSignRiders();
    upgradeBike(false);
    hireStaff(false);

    if (game.raceNumber === Math.floor(game.seasonRaces / 2)) processSponsorPayouts();
    if (game.raceNumber === Math.floor(game.seasonRaces / 2)) boardApprovalCheck();

    updateStandings();
    updateNews(`Race ${game.raceNumber} completed at ${track.name}!`);
    game.raceNumber++;

    // =======================
    // END OF SEASON CHECK
    // =======================
    if (game.raceNumber > game.seasonRaces) {
        showScreen('standingsScreen');
        let summaryDiv = document.getElementById("standingsList");
        summaryDiv.innerHTML = "<h3>Season Summary</h3>";

        let totalPoints = game.playerTeam.riders.reduce((sum, r) => sum + r.points, 0);
        summaryDiv.innerHTML += `<p>Total Points: ${totalPoints}</p>`;

        let sponsorBonus = 0;
        game.sponsors.forEach(s => {
            if (totalPoints >= 50) {
                sponsorBonus += s.payout;
                updateNews(`${s.name} paid $${s.payout} for meeting objectives!`);
            } else {
                updateNews(`${s.name} withheld payment.`);
            }
        });
        game.money += sponsorBonus;
        summaryDiv.innerHTML += `<p>Sponsor Bonus: $${sponsorBonus}</p>`;

        if (totalPoints >= game.seasonRaces * 15) {
            updateNews("Board is pleased with your season performance!");
            summaryDiv.innerHTML += `<p>Board Evaluation: Positive</p>`;
        } else {
            updateNews("Board is disappointed with your season performance. Budget reduced!");
            game.money -= 50000;
            summaryDiv.innerHTML += `<p>Board Evaluation: Negative</p>`;
        }

        summaryDiv.innerHTML += `<p>End-of-Season Money: $${game.money}</p>`;
        summaryDiv.innerHTML += `<p>Reputation: ${game.reputation}</p>`;

        updateStandings();
    }
}

// =======================
// INIT GAME
// =======================
generateTracks();
generateRiders();
generateAITeams();
generateSponsors();
updateTeam();
updateMarket();
updateStandings();
updateNews("Welcome to Podium MX Master 26! Let the season begin!");
