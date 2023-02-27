const userName = document.getElementById('userName');
const level = document.getElementById('level');
const character = document.getElementById('character');
const match = document.getElementById('match');

const nickname = "Chloe";

const headers = {
  'x-api-key': "token"
};

window.onload = function() {
  document.getElementsByClassName('container')[0].style.display = "block";
  getProfile();
};

const fetchData = async (url) => {
  const response = await fetch(url, { headers });
  return response.json();
};

async function getUserNum() {
  const { user } = await fetchData(`https://open-api.bser.io/v1/user/nickname?query=${nickname}`);
  return user.userNum;
};

async function getProfile() {
  const userNum = await getUserNum();
  const [history, matchs] = await Promise.all([getHistory(userNum), getMatchs()]);

  userName.innerHTML = nickname;
  level.style.display = "block";

  level.innerHTML = history[0].accountLevel;
  character.src = `assets/imgs/characters/${history[0].characterNum}.png`;
  document.getElementsByClassName('loading-img')[0].style.display = "none";
  match.innerHTML = matchs;
};

async function getHistory(userNum) {
  const { userGames } = await fetchData(`https://open-api.bser.io/v1/user/games/${userNum}`);
  return userGames;
};

const getMatchs = async () => {
  const userNum = await getUserNum();
  const match = await getHistory(userNum);

  if (!match) {
    return "No info";
  };

  let t;
  match.length >= 4 ? t = 4 : t = match.length;

  let content = "";
  content = getLoop(match, t);

  return content;
};

function getLoop(match , t) {
  let content = "";

  for(let i=0; i < t; i++) {

    let = { 
      gameRank, characterNum, escapeState, matchingMode, gameMode, matchingTeamMode, playerKill, playerAssistant, playerDeaths, 
      monsterKill, serverName, mmrAfter, mmrGain
    } = match[i];

    let pdl = mmrGain;
    let mmr = mmrAfter;

    if (pdl > 1) {
      pdl = `<span style="color: green; font-weight: bold;"> +${pdl}</span>`;
    } else if (pdl === 0) {
      pdl = "";
    } else {
      pdl = `<span style="color: red; font-weight: bold;">${pdl}</span>`;
    }

    //--//
    if(escapeState === 3) {
      gameRank = `Escape Success! <br>${gameModeList()[matchingTeamMode]} ${gameModeName()[matchingMode]} </br>${serverName}`;
    } else if(escapeState === 1 || escapeState === 2) {
      gameRank = `Escape Fail! <br>${gameModeList()[matchingTeamMode]} ${gameModeName()[matchingMode]} </br>${serverName}`;
    } else if(matchingMode === 6 && gameRank === 1) {
      gameRank = `<span style="color: green; font-weight: bold;"> Victory!</span> </br>Cobalt </br>${serverName}`;
    } else if(matchingMode === 6 && gameRank === 2){
      gameRank = `<span style="color: red; font-weight: bold;">Defeat</span> </br>Cobalt </br>${serverName}`;
    } else if (matchingMode === 2) {
      gameRank = `#${gameRank} <br>${gameModeList()[matchingTeamMode]} ${gameModeName()[matchingMode]} </br>${serverName}`;
    } else if (matchingMode === 3) {
      gameRank = `#${gameRank} <br>${gameModeList()[matchingTeamMode]} ${gameModeName()[matchingMode]} </br>${serverName}`;
    };

    //--//
    if(matchingMode === 2) {
      playerInfo = `<td><img src=../../assets/imgs/characters/${characterNum}.png class="tabela-img"></td> <td>${playerKill} / ${playerAssistant} / ${monsterKill} <br>K / A / H</td>`;
    } else if(matchingMode === 6) {
      playerInfo = `<td><img src=../../assets/imgs/characters/${characterNum}.png class="tabela-img"></td> <td>${playerKill} / ${playerDeaths} / ${playerAssistant} <br>K / D / A</td>`;
    } else {
      playerInfo = `<td><img src=../../assets/imgs/characters/${characterNum}.png class="tabela-img"> <img class="elo" src=${elo(mmr)}></td> <td>${playerKill} / ${playerAssistant} / ${monsterKill} <br>K / A / H</td> <td>${mmr} ${pdl} <br>MMR</td></td>`;
    };
    
    content += `
    <table class="tabela">
      <tr>
        <th scope="row">
          <center>
            ${gameRank}
          </center>
          </th>
        ${playerInfo}
      </tr>
    </table>
    `
  };

  return content;
}

function gameModeList() {
  const list = {
    1: "Solo",
    2: "Duo",
    3: "Squad"
  }

  return list;
}

function gameModeName() {
  const name = {
    2: "Normal",
    3: "Ranked"
  }

  return name;
}

function elo(mmr) {
	
  let elo;
	
	if(mmr > 0 && mmr < 400) {
		elo = "assets/imgs/elo/1.png";
	} else if(mmr >= 400 && mmr < 800) {
		elo = "assets/imgs/elo/2.png";
	} else if(mmr >= 800 && mmr < 1200) {
		elo = "assets/imgs/elo/3.png";
	} else if(mmr >= 1200 && mmr < 1600) {
		elo = "assets/imgs/elo/4.png";
	} else if(mmr >= 1600 && mmr < 2000) {
		elo = "assets/imgs/elo/5.png";
	} else if(mmr >= 2000 && mmr < 2400) {
		elo = "assets/imgs/elo/6.png";
  } else if(mmr >= 2400 && mmr < 2600) {
		elo = "assets/imgs/elo/9.png";
	} else if(mmr >= 2400 && mmr < 2600) {
		elo = "assets/imgs/elo/8.png";
	} else if(mmr >= 2600) {
		elo = "assets/imgs/elo/8.png";
	} else {
		elo = "assets/imgs/elo/0.png";
	}
  return elo;
};