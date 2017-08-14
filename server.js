'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const pad = require('pad');

var request = require('request');
var cheerio = require('cheerio');

const url = "http://svenskfotboll.se/allsvenskan/tabell-och-resultat/";

const aik = "AIK";
const eskilstuna = "Athletic Eskilstuna";
const hacken = "BK Häcken";
const djurgarden = "Djurgården";
const sundsvall = "GIF Sundsvall";
const halmstad = "Halmstad";
const hammarby = "Hammarby";
const elfsborg = "IF Elfsborg";
const goteborg = "IFK Göteborg";
const norrkoping = "IFK Norrköping FK";
const sirius = "IK Sirius FK";
const jonkoping = "Jönköpings Södra IF";
const kalmar = "Kalmar FF";
const malmo = "Malmö FF";
const orebro = "Örebro";
const ostersund = "Östersund";

const roland = "roland";
const meidi = "meidi";
const martin = "martin";
const simonr = "simonr";
const jonathan = "jonathan";
const andreasvalegard = "andreasvalegard";
const eschmidt = "eschmidt";
const gustavjo = "gustavjo";
const carolinajansson = "carolinajansson";
const dan = "dan";
const linda = "linda";
const jonasskold = "jonasskold";
const patrikericsson = "patrik.ericsson";
const camilla = "camilla";

const persons = [
    roland,
    meidi,
    martin,
    simonr,
    jonathan,
    andreasvalegard,
    eschmidt,
    gustavjo,
    carolinajansson,
    dan,
    linda,
    jonasskold,
    patrikericsson,
    camilla
];

const picks = {
    // "2","14","9","1","8","10","3","7","4","5","13","15","12","6","11","16","Ingen","Djurgården"
    roland: {
        picks: [
            djurgarden, // 1
            aik, // 2
            hammarby, // 3
            goteborg, // 4
            norrkoping, // 5
            malmo, // 6
            elfsborg, // 7
            sundsvall, // 8
            hacken, // 9
            halmstad, // 10
            orebro, // 11
            kalmar, // 12
            sirius, // 13
            eskilstuna, // 14
            jonkoping, // 15
            ostersund // 16
        ]
    },
    
    // "2","15","3","16","4","5","1","6","7","8","9","10","11","12","13","14","Zlatan","AIK"
    meidi: {
        picks: [
            hammarby, // 1
            aik, // 2
            hacken, // 3
            sundsvall, // 4
            halmstad, // 5
            elfsborg, // 6
            goteborg, // 7
            norrkoping, // 8
            sirius, // 9
            jonkoping, // 10
            kalmar, // 11
            malmo, // 12
            orebro, // 13
            ostersund, // 14
            eskilstuna, // 15
            djurgarden // 16
        ]
    },
    
    // "3","16","10","5","14","15","11","6","2","4","13","12","7","1","9","8","Sebastian Andersson","Sirius"
    martin: {
        picks: [
            malmo, // 1
            goteborg, // 2
            aik, // 3
            norrkoping, // 4
            djurgarden, // 5
            elfsborg, // 6
            kalmar, // 7
            ostersund, // 8
            orebro, // 9
            hacken, // 10
            hammarby, // 11
            jonkoping, // 12
            sirius, // 13
            sundsvall, // 14
            halmstad, // 15
            eskilstuna // 16
        ]
    },
    
    // "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","Göran vinner alltid Skytte-ligan. ","Häcken. Hahahahahaha. Häcken. "
    simonr: {
        picks: [
            aik, // 1
            eskilstuna, // 2
            hacken, // 3
            djurgarden, // 4
            sundsvall, // 5
            halmstad, // 6
            hammarby, // 7
            elfsborg, // 8
            goteborg, // 9
            norrkoping, // 10
            sirius, // 11
            jonkoping, // 12
            kalmar, // 13
            malmo, // 14
            orebro, // 15
            ostersund // 16
        ]
    },
    
    // "12","8","13","15","10","4","16","1","6","14","2","9","5","11","7","3","Tomas Brolin","Bajen"
    jonathan: {
        picks: [
            elfsborg, // 1
            sirius, // 2
            ostersund, // 3
            halmstad, // 4
            kalmar, // 5
            goteborg, // 6
            orebro, // 7
            eskilstuna, // 8
            jonkoping, // 9
            sundsvall, // 10
            malmo, // 11
            aik, // 12
            hacken, // 13
            norrkoping, // 14
            djurgarden, // 15
            hammarby // 16
        ]
    },
    
    // "2","14","3","6","11","15","9","8","7","5","13","16","10","1","12","4","Pawel Cibicki","AFC Eskilstuna"
    andreasvalegard: {
        picks: [
            malmo, // 1
            aik, // 2
            hacken, // 3
            ostersund, // 4
            norrkoping, // 5
            djurgarden, // 6
            goteborg, // 7
            elfsborg, // 8
            hammarby, // 9
            kalmar, // 10
            sundsvall, // 11
            orebro, // 12
            sirius, // 13
            eskilstuna, // 14
            halmstad, // 15
            jonkoping // 16
        ]
    },
    
    // "1","15","7","3","11","8","13","9","4","5","16","10","6","2","14","12","Sulejman Krpić","Malmö FF"
    eschmidt: {
        picks: [
            aik, // 1
            malmo, // 2
            djurgarden, // 3
            goteborg, // 4
            norrkoping, // 5
            kalmar, // 6
            hacken, // 7
            halmstad, // 8
            elfsborg, // 9
            jonkoping, // 10
            sundsvall, // 11
            ostersund, // 12
            hammarby, // 13
            orebro, // 14
            eskilstuna, // 15
            sirius // 16
        ]
    },
    
    // "3","16","6","2","15","11","14","8","5","4","12","13","7","1","9","10","Aliou Badji","Malmö"
    gustavjo: {
        picks: [
            malmo, // 1
            djurgarden, // 2
            aik, // 3
            norrkoping, // 4
            goteborg, // 5
            hacken, // 6
            kalmar, // 7
            elfsborg, // 8
            orebro, // 9
            ostersund, // 10
            halmstad, // 11
            sirius, // 12
            jonkoping, // 13
            hammarby, // 14
            sundsvall, // 15
            eskilstuna // 16
        ]
    },
    
    // "2","16","10","8","14","11","9","7","5","4","12","15","3","1","6","13","Igboananike ÖSK","AIK"
    carolinajansson: {
        picks: [
            malmo, // 1
            aik, // 2
            kalmar, // 3
            norrkoping, // 4
            goteborg, // 5
            orebro, // 6
            elfsborg, // 7
            djurgarden, // 8
            hammarby, // 9
            hacken, // 10
            halmstad, // 11
            sirius, // 12
            ostersund, // 13
            sundsvall, // 14
            jonkoping, // 15
            eskilstuna // 16
        ]
    },
    
    // "3","16","7","6","13","12","9","5","2","4","14","15","10","1","11","8","Markus Rosenberg","Hammarby"
    dan: {
        picks: [
            malmo, // 1
            goteborg, // 2
            aik, // 3
            norrkoping, // 4
            elfsborg, // 5
            djurgarden, // 6
            hacken, // 7
            ostersund, // 8
            hammarby, // 9
            kalmar, // 10
            orebro, // 11
            halmstad, // 12
            sundsvall, // 13
            sirius, // 14
            jonkoping, // 15
            eskilstuna // 16
        ]
    },
    
    // "1","15","5","10","11","16","9","6","8","4","14","13","12","3","7","2","Jiloan Hamad, Hammarby","Malmö"
    linda: {
        picks: [
            aik, // 1
            ostersund, // 2
            malmo, // 3
            norrkoping, // 4
            hacken, // 5
            elfsborg, // 6
            orebro, // 7
            goteborg, // 8
            hammarby, // 9
            djurgarden, // 10
            sundsvall, // 11
            kalmar, // 12
            jonkoping, // 13
            sirius, // 14
            eskilstuna, // 15
            halmstad // 16
        ]
    },
    
    // "3","15","5","6","12","14","8","7","2","4","16","11","9","1","10","13","Markus Rosenberg","Sundsvall"
    jonasskold: {
        picks: [
            malmo, // 1
            goteborg, // 2
            aik, // 3
            norrkoping, // 4
            hacken, // 5
            djurgarden, // 6
            elfsborg, // 7
            hammarby, // 8
            kalmar, // 9
            orebro, // 10
            jonkoping, // 11
            sundsvall, // 12
            ostersund, // 13
            halmstad, // 14
            eskilstuna, // 15
            sirius // 16
        ]
    },
    
    // "2","16","6","4","13","15","11","8","5","3","12","14","10","1","9","7","Alhassan Kamara","Malmö FF"
    "patrik.ericsson": {
        picks: [
            malmo, // 1
            aik, // 2
            norrkoping, // 3
            djurgarden, // 4
            goteborg, // 5
            hacken, // 6
            ostersund, // 7
            elfsborg, // 8
            orebro, // 9
            kalmar, // 10
            hammarby, // 11
            sirius, // 12
            sundsvall, // 13
            jonkoping, // 14
            halmstad, // 15
            eskilstuna // 16
        ]
    },
    
    // "1","15","6","7","16","2","8","9","3","4","14","13","11","5","10","12","Henok Goitom","Häcken"
    camilla: {
        picks: [
            aik, // 1
            halmstad, // 2
            goteborg, // 3
            norrkoping, // 4
            malmo, // 5
            hacken, // 6
            djurgarden, // 7
            hammarby, // 8
            elfsborg, // 9
            orebro, // 10
            kalmar, // 11
            ostersund, // 12
            jonkoping, // 13
            sirius, // 14
            eskilstuna, // 15
            sundsvall // 16
        ]
    }
};

const pointsPerPosition = [10, 5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function linda_calculateScore(person, standings) {
    var score = 0;
    const individualPicks = picks[person].picks;
    for (var i = 0; i < standings.length; i++) {
        const team = standings[i];
        const pickedTeam = individualPicks[i];
        if (team.name == pickedTeam) {
            score += pointsPerPosition[i];
        }
    }
    return score;
}

function scoresForPicks(picks, standings) {
    var scores = [];

    for (var p = 0; p < picks.length; p++) {
        
        const currentPick = picks[p];
        const picksBelowPick = picks.slice(p + 1);

        const pickIndexInStandings = standings.findIndex(function (team) {
            return team.name == currentPick;
        });
        
        const teamsBelowPickInStandings = standings.slice(pickIndexInStandings + 1);
        
        const teamsInBoth = teamsBelowPickInStandings.filter(function (team) {
            return picksBelowPick.includes(team.name)
        });
        
        scores.push(teamsInBoth.length);
    }
	
    return scores;
}

function roland_calculateScore(person, standings) {
    var score = 0;
    const picksForPerson = picks[person].picks;

    for (var p = 0; p < picksForPerson.length; p++) {
        
        const currentPick = picksForPerson[p];
	const picksBelowPick = picksForPerson.slice(p + 1);

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


function calculateScores(standings) {
    var scores = [];
    for (var index in persons) {
        const person = persons[index];
        const score = {
            person: person,
            points: roland_calculateScore(person, standings)
        };
        scores.push(score)
    }
    return scores.sort(function (a, b) {return b.points - a.points});
}

function updateScores(completionFunction) {
    request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);
        
            var rows = $('tbody','.clTblStandings').find('tr');

            console.log("");

            var standings = [];
            for (var i = 0; i < rows.length; i++) {
                const row = rows[i];
                const columns = $(row).find('td');
                const team = {
                    name: $(columns[0]).text(),
                    gamesPlayed: parseInt($(columns[1]).text()),
                    gamesWon: parseInt($(columns[2]).text()),
                    gamesDrawn: parseInt($(columns[3]).text()),
                    gamesLost: parseInt($(columns[4]).text()),
                    goalsScored: parseInt($(columns[5]).text().split("-")[0]),
                    goalsAllowed: parseInt($(columns[5]).text().split("-")[1]),
                    goalDifferential: parseInt($(columns[6]).text()),
                    points: parseInt($(columns[7]).text()),
                    position: (i + 1)
                }
                console.log(team.position + ". " + team.name + " " + team.points + " p");
                standings.push(team);
            }
        
            console.log("");
        
            const scores = calculateScores(standings);
            for (var i = 0; i < scores.length; i++) {
                const score = scores[i];
                console.log((i + 1) + ". " + score.person + " " + score.points + " p");
            }
        
            console.log("");
            
            completionFunction(standings, scores);
                
        } else {
            console.log("Error: " + error)
        }
    });
}

function updateFantasyPremierLeague(completionFunction) {
    request(url, function (error, response, body) {
        if (!error) {

            console.log("");

			try {
				const standings = JSON.parse(body);
				completionFunction(standings);
			} catch (e) {
		        console.log("ERROR: Failed to parse fantasy premier league json");
			}
        
            console.log("");
                            
        } else {
            console.log("Error: " + error)
        }
    });
}

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})


var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`hi\` - to demonstrate a conversation that tracks state.
\`thanks\` - to demonstrate a simple response.
\`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
\`attachment\` - to see a Slack attachment message.
`

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

slapp.message('update', ['mention', 'direct_message'], (msg) => {
    updateScores(function (standings, scores) {
        
        var output = "```\n";
        
        for (var i = 0; i < standings.length; i++) {
            const entry = standings[i];
            const position = pad(2, String(i + 1));
            const teamName = pad(entry.name, 20);
            const points = pad(2, String(entry.points));
	    const gamesPlayed = pad(2, String(entry.gamesPlayed));
            output += position + ". " + teamName + "   " + points + "p   " + gamesPlayed + " matcher\n";
        }
        
        output +="```\n\n";
        
        output += "```\n"
        
        for (var i = 0; i < scores.length; i++) {
            const entry = scores[i];
            const position = pad(2, String(i + 1));
            const person = pad(entry.person, 20);
            const points = pad(2, String(entry.points));
            output += position + ". " + person + "   " + points + "p\n";            
        }
        
        output += "```\n";
                
        msg.say(output);
    });
})

slapp.message('picks (.*)', ['mention', 'direct_message'], (msg, text, name) => {
    updateScores(function (standings, scores) {
        
        if (!(name in picks)) {
            msg.say("Det som " + name + " gör med en fotboll kan jag göra med en apelsin.");
            return;
        }
        const individualPicks = picks[name].picks;
        
        var scores = scoresForPicks(individualPicks, standings);
        
        var output = "```\n" + name + " har tippat så här:\n\n";
        
        for (var i = 0; i < individualPicks.length; i++) {
            const position = pad(2, String(i + 1));
            const teamName = individualPicks[i];
            const pointsForPick = scores[i];
            output += pad(position + ". " + teamName, 25) + "(" + pad(2, String(pointsForPick)) + "p)\n";
        }
        
        output +="```\n";
                
        msg.say(output);
    });
})

slapp.message('fpl', ['mention', 'direct_message'], (msg) => {
    updateFantasyPremierLeague(function (standings) {
        
        var output = "```\n";
		
		for (var i = 0; i < standings.length; i++) {
            const position = pad(2, String(i + 1));
			const entry = standings[i];
			const teamName = entry.entry_name;
			const playerName = entry.play;
			const points = entry.total;
			output += pad(position + ". " + teamName, 25) + "(" + pad(2, String(points)) + "p)\n";
		}
                
        output += "```\n";
                
        msg.say(output);
    });
})

// "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
slapp
  .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
    msg
      .say(`${text}, how are you?`)
      // sends next event from user to this route, passing along state
      .route('how-are-you', { greeting: text })
  })
  .route('how-are-you', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!text) {
      return msg
        .say("Whoops, I'm still waiting to hear how you're doing.")
        .say('How are you?')
        .route('how-are-you', state)
    }

    // add their response to state
    state.status = text

    msg
      .say(`Ok then. What's your favorite color?`)
      .route('color', state)
  })
  .route('color', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!text) {
      return msg
        .say("I'm eagerly awaiting to hear your favorite color.")
        .route('color', state)
    }

    // add their response to state
    state.color = text

    msg
      .say('Thanks for sharing.')
      .say(`Here's what you've told me so far: \`\`\`${JSON.stringify(state)}\`\`\``)
    // At this point, since we don't route anywhere, the "conversation" is over
  })

// Can use a regex as well
slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
  // You can provide a list of responses, and a random one will be chosen
  // You can also include slack emoji in your responses
  msg.say([
    "You're welcome :smile:",
    'You bet',
    ':+1: Of course',
    'Anytime :sun_with_face: :full_moon_with_face:'
  ])
})

// demonstrate returning an attachment...
slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
  msg.say({
    text: 'Check out this amazing attachment! :confetti_ball: ',
    attachments: [{
      text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
      title: 'Slapp Library - Open Source',
      image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
      title_link: 'https://beepboophq.com/',
      color: '#7CD197'
    }]
  })
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
