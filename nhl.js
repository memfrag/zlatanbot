
var request = require('request');
const pad = require('pad');

const nhlStandingsURL = "https://statsapi.web.nhl.com/api/v1/standings?season=20172018";

function updateNHLStandings(completion) {
    request(nhlStandingsURL, function (error, response, body) {
        if (!error) {

            console.log("");

			const jsonData = JSON.parse(body);
						
			const standings = makeNHLStandings(jsonData.records);
        
            console.log("");
                        
			completion(standings);   
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

exports.updateNHLStandings = updateNHLStandings;
