
var request = require('request');
const pad = require('pad');

const nhlStandingsURL = "https://statsapi.web.nhl.com/api/v1/standings?season=20172018";

function updateNHLStandings(completion) {
    request(nhlStandingsURL, function (error, response, body) {
        if (!error) {

            console.log("");

			const jsonData = JSON.parse(body);
						
			const standings = makeNHLStandings(jsonData.records);
        
            const scores = makeNHLScores(jsonData.records);
        
            console.log("");
                        
			completion(standings, scores);   
        } else {
            console.log("Error: " + error);
			completion("Det sket sig. :-( " + error);
        }
    });
}

function makeNHLStandings(records) {
    
    var output = "```\nNHL Standings\n\n";
	
	var conferences = {
		"Eastern": [],
		"Western": []
	};
	
	for (var r = 0; r < records.length; r++) {
		const record = records[r];
		const conferenceName = record.conference.name;
		for (var t = 0; t < record.teamRecords.length; t++) {
			const teamRecord = record.teamRecords[t];
			const teamName = teamRecord.team.name;
			const conferenceRank = teamRecord.conferenceRank;
			const points = teamRecord.points;
			conferences[conferenceName].push({
				name: teamName,
				rank: conferenceRank,
				points: points
			});
		} 
	}
	
	conferences["Eastern"].sort(function(a, b) {
		return a.rank - b.rank;
	});
	conferences["Western"].sort(function(a, b) {
		return a.rank - b.rank;
	});
	
	output += pad("WESTERN CONFERENCE", 25) + "         EASTERN CONFERENCE\n\n";
	
	for (var i = 0; i < 16; i++) {
		const position = pad(2, String(i + 1));
		if (i < 15) {
			const westernTeam = conferences["Western"][i];
			output += pad(position + ". " + westernTeam.name, 25) + pad(" " + westernTeam.points + "p", 5);
		} else {
			output += pad(" ", 30);
		}
		const easternTeam = conferences["Eastern"][i];
		output += "    " + pad(position + ". " + easternTeam.name, 25) + pad(" " + easternTeam.points + "p", 5);
		
		output += "\n";
	}
	            
    output += "```\n";
            
    return output;
}

var persons = [
    "dan", "elin", "eschmidt", "fredrik.bystam", "john", "jonasskold", "linda", "martin", "robertaxelsson", "schlyter"
]

var picks = {
    "dan": {
        eastern: ["nyr", "det", "njd", "tor", "mtl", "pit", "fla", "ott", "bos", "car", "wsh", "buf", "cbj", "nyi", "tbl", "phi"],
        western: ["col", "edm", "van", "ana", "sjs", "lak", "cgy", "chi", "ari", "wpg", "dal", "vgk", "nsh", "min", "stl"]
    },
    "elin": {
        eastern: ["det", "pit", "phi", "tbl", "wsh", "nyr", "nyi", "fla", "bos", "buf", "car", "cbj", "mtl", "njd", "ott","tor"],
        western: ["sjs", "chi", "dal", "ana", "stl", "min", "nsh", "ari", "lak", "col", "van", "vgk", "cgy", "wpg", "edm"]
    },
    "eschmidt": {
        eastern: ["pit", "bos", "nyr", "ott", "det", "wsh", "tbl", "cbj", "nyi", "tor", "mtl", "phi", "buf", "fla", "car", "njd"],
        western: ["nsh", "chi", "ana", "sjs", "lak", "vgk", "edm", "min", "cgy", "stl", "van", "wpg", "dal", "col", "ari"]
    },
    "fredrik.bystam": {
        eastern: ["mtl", "wsh", "cbj", "pit", "ott", "nyi", "bos", "tor", "nyr", "fla", "car", "tbl", "buf", "phi", "njd", "det"],
        western: ["edm", "ana", "stl", "chi", "min", "vgk", "nsh", "lak", "dal", "wpg", "sjs", "ari", "van", "cgy", "col"]
    },
    "john": {
        eastern: ["pit", "tbl", "wsh", "tor", "nyr", "ott", "mtl", "cbj", "bos", "nyi", "phi", "fla", "njd", "car", "buf", "det"],
        western: ["edm", "nsh", "ana", "chi", "min", "sjs", "stl", "wpg", "dal", "lak", "ari", "cgy", "vgk", "van", "col"]
    },
    "jonasskold": {
        eastern: ["wsh", "pit", "nyr", "bos", "mtl", "tbl", "nyi", "cbj", "det", "ott", "tor", "car", "njd", "fla", "phi", "buf"],
        western: ["stl", "chi", "ana", "nsh", "dal", "min", "edm", "lak", "sjs", "van", "vgk", "cgy", "wpg", "col", "ari"]
    },
    "linda": {
        eastern: ["mtl", "wsh", "pit", "ott", "cbj", "tbl", "nyr", "bos", "tor", "car", "det", "buf", "fla", "njd", "nyi", "phi"],
        western: ["chi", "ana", "edm", "sjs", "stl", "nsh", "col", "cgy", "min", "vgk", "ari", "dal", "lak", "van", "wpg"]
    },
    "martin": {
        eastern: ["wsh", "pit", "cbj", "mtl", "tor", "nyr", "tbl", "car", "nyi", "ott", "bos", "phi", "fla", "det", "njd", "buf"],
        western: ["edm", "ana", "sjs", "nsh", "min", "stl", "lak", "dal", "wpg", "chi", "ari", "cgy", "van", "vgk", "col"]
    },
    "robertaxelsson": {
        eastern: ["pit", "wsh", "bos", "nyr", "cbj", "mtl", "ott", "phi", "det", "tor", "nyi", "njd", "fla", "car", "tbl", "buf"],
        western: ["ana", "nsh", "chi", "min", "stl", "edm", "sjs", "cgy", "vgk", "lak", "ari", "col", "dal", "wpg", "van"]
    },
    "schlyter": {
        eastern: ["wsh", "nyr", "cbj", "pit", "bos", "mtl", "ott", "tor", "car", "det", "phi", "nyi", "tbl", "njd", "fla", "buf"],
        western: ["chi", "ana", "cgy", "min", "sjs", "stl", "edm", "nsh", "lak", "dal", "van", "vgk", "col", "wpg", "ari"]
    }
};

var nhlTeams = {
    "ana": "Anaheim Ducks",
    "ari": "Arizona Coyotes",
    "bos": "Boston Bruins",
    "buf": "Buffalo Sabres",
    "car": "Carolina Hurricanes",
    "cbj": "Columbus Blue Jackets",
    "cgy": "Calgary Flames",
    "chi": "Chicago Blackhawks",
    "col": "Colorado Avalanche",
    "dal": "Dallas Stars",
    "det": "Detroit Red Wings",
    "edm": "Edmonton Oilers",
    "fla": "Florida Panthers",
    "lak": "Los Angeles Kings",
    "min": "Minnesota Wild",
    "mtl": "Montreal Canadiens",
    "njd": "New Jersey Devils",
    "nsh": "Nashville Predators",
    "nyi": "New York Islanders",
    "nyr": "New York Rangers",
    "ott": "Ottawa Senators",
    "phi": "Philadelphia Flyers",
    "pit": "Pittsburgh Penguins",
    "sjs": "San Jose Sharks",
    "stl": "St Louis Blues",
    "tbl": "Tampa Bay Lightning",
    "tor": "Toronto Maple Leafs",
    "van": "Vancouver Canucks",
    "vgk": "Vegas Golden Knights",
    "wpg": "Winnipeg Jets",
    "wsh": "Washington Capitals"
};

function calculateScores(standings) {
    var scores = [];
    for (var index in persons) {
        const person = persons[index];
        const score = {
            person: person,
            points: calculateScore(person, standings)
        };
        scores.push(score)
    }
    return scores.sort(function (a, b) {return b.points - a.points});
}

function calculateScore(person, standings) {
    var score = 0;
    const picksForPerson = picks[person];
    score += calculateConferenceScore(picksForPerson.eastern, standings["Eastern"]);
    score += calculateConferenceScore(picksForPerson.western, standings["Western"]);
    return score;
}

function calculateConferenceScore(picksForPerson, standings) {
    var score = 0;

    for (var p = 0; p < picksForPerson.length; p++) {
        
        const currentPick = nhlTeams[picksForPerson[p]];
	    const picksBelowPick = picksForPerson.slice(p + 1).map(function (pick) { return nhlTeams[pick]; });

        const pickIndexInStandings = standings.findIndex(function (team) {
            return team.name == currentPick;
        });
        
        const teamsBelowPickInStandings = standings.slice(pickIndexInStandings + 1);
        
        const teamsInBoth = teamsBelowPickInStandings.filter(function (team) {
            return picksBelowPick.includes(team.name)
        });
        
        score += teamsInBoth.length;
    }
	
    return score;
}

function makeNHLScores(records) {
    
    var output = "```\nNHL Picks\n\n";
	
	var conferences = {
		"Eastern": [],
		"Western": []
	};
	
	for (var r = 0; r < records.length; r++) {
		const record = records[r];
		const conferenceName = record.conference.name;
		for (var t = 0; t < record.teamRecords.length; t++) {
			const teamRecord = record.teamRecords[t];
			const teamName = teamRecord.team.name;
			const conferenceRank = teamRecord.conferenceRank;
			const points = teamRecord.points;
			conferences[conferenceName].push({
				name: teamName,
				rank: conferenceRank,
				points: points
			});
		} 
	}
	
	conferences["Eastern"].sort(function(a, b) {
		return a.rank - b.rank;
	});
	conferences["Western"].sort(function(a, b) {
		return a.rank - b.rank;
	});
	
    var scores = calculateScores(conferences);
    
    for (var i = 0; i < scores.length; i++) {
        const score = scores[i];
        output += ((i + 1) + ". " + score.person + " " + score.points + " p");
    }
	            
    output += "```\n";
            
    return output;
}

exports.updateNHLStandings = updateNHLStandings;
