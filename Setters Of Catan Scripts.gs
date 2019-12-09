/**
 * Settlers Of Catan Leaderboard Sorting and Ranking Scripts
 * @Author: Ethan Horvath
 * @Date Started: November 6th, 2019
 */

function settlersOfCatan(playerAmount){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var games = sheet.getRange('B2:G').getValues(); //GAMES ARRAY [][]
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  var players = getListOfPlayers();
  var stats = [];
  
  for(var i = 0; i < players.length; i++){
   stats[i] = [players[i], getTotalWins(players[i]), getTotalGames(players[i]), getTotalWins(players[i]) / getTotalGames(players[i]), getIdealWR(players[i]), getLongestWinstreak(players[i]), getLongestLossstreak(players[i])];
  }
  
  return stats;
      
}



function getTotalGames(player){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var games = sheet.getRange('B2:G').getValues(); //GAMES ARRAY [][]
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  var numOfGamesPlayed = 0;
  for(var i = 0; i < numOfGame; i++){
    for(var j = 0; j < 6; j++){
      if(player == games[i][j])
        numOfGamesPlayed++;
    }
  }
  return numOfGamesPlayed;
}
   
function getTotalWins(player){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var wins = sheet.getRange('B2:B').getValues(); //WINS COLUMN
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  var numOfWins = 0;
  for(var i = 0; i < numOfGame; i++){
    if(wins[i] == player)
      numOfWins++;
  }
  
  if(player == "Ethan")
    numOfWins++;
  
  return numOfWins;
}     
   
function getListOfPlayers(){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var games = sheet.getRange('B2:G').getValues(); //GAMES ARRAY [][]
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  var players = [];
  for(var i = 0; i < numOfGame; i++){
    for(var j = 0; j < 6; j++){
      if(games[i][j] != "" && players.length == 0){
        players.push(games[i][j]);
     }else if(games[i][j] != ""){
        var isPlayerOld = false;
        for(var r = 0; r < players.length; r++){
          if(games[i][j] == players[r])
             isPlayerOld = true;
          if(games[i][j] != players[r] & r == players.length-1 & isPlayerOld == false)
            players.push(games[i][j]);
        }
     }
    }
  }
  return players;
}

function getLongestLossstreak(playerCell){ //GETS LONGEST LOSSSTREAK FOR ACTIVE PLAYER
  //INITIALIZING VARIABLES
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var wins = sheet.getRange('B2:B').getValues(); //WINS COLUMN
  var losses = sheet.getRange('C2:G').getValues(); //LOSS ARRAY
  var longestStreak = 0;
  var currentStreak = 0;
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  
  //LOOPING THRU TO GET LOSSSTREAK COUNT
  
  for(var i = 0; i < numOfGame; i++){
    if(losses[i][0] == playerCell || losses[i][1] == playerCell || losses[i][2] == playerCell || losses[i][3] == playerCell || losses[i][4] == playerCell){
      currentStreak++;
      if(currentStreak > longestStreak){
        longestStreak = currentStreak;
      }
    }
    else if(losses[i][0] != playerCell && losses[i][1] != playerCell && losses[i][2] != playerCell && losses[i][3] != playerCell && losses[i][4] != playerCell && wins[i] == playerCell){
      currentStreak = 0;
    }
  }
  
 return longestStreak;
}

function getLongestWinstreak(playerCell){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  //INITIALIZING VARIABLES
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var longestStreak = 0;
  var currentStreak = 0;
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  
  
  //LOOPING THRU TO GET WINSTREAK COUNT
  
  for(var i = 0; i < numOfGame; i++){
    if(wins[i] == playerCell){
      currentStreak++;
      if(currentStreak > longestStreak){
        longestStreak = currentStreak;
      }
    }
    else if(wins[i] != playerCell && getLoss(playerCell, i) == 1){
      currentStreak = 0;
    }
  }
  
  function getLoss(playerCell, i){
    if(losses[i][0] == playerCell || losses[i][1] == playerCell || losses[i][2] == playerCell || losses[i][3] == playerCell || losses[i][4] == playerCell){
            return 1;                                                                                                                         
    }else{
          return 0;                                                                                                                           
    }
  }
 return longestStreak;
}

function getIdealWR(playerCell){ //GETS IDEAL WINRATE THAT EACH PLAYER SHOULD GET IN A PERFECT WORLD
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var games = sheet.getRange('B2:G').getValues(); //GAMES ARRAY [][]
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  
  var threePersonGames = 0;
  var fourPersonGames = 0;
  var fivePersonGames = 0;
  var sixPersonGames = 0;
  
  for(var i = 0; i < numOfGame; i++){ //TALLYING UP THE NUMBER OF 3/4/5/6 PERSON GAMES
    var numOfPlayers = 0;
    var isPlayerInGame = false;
    
    for(var j = 0; j < 6; j++){
      if(games[i][j] != "")
        numOfPlayers++;
      if(games[i][j] == playerCell)
        isPlayerInGame = true;
    }
    
    if(isPlayerInGame == true){
      if(numOfPlayers == 3)
        threePersonGames++;
      if(numOfPlayers == 4)
        fourPersonGames++;
      if(numOfPlayers == 5)
        fivePersonGames++;
      if(numOfPlayers == 6)
        sixPersonGames++;
    }
    }
  
  //GETTING IDEAL WIN RATE
  var top = (1/3)*threePersonGames + (1/4)*fourPersonGames + (1/5)*fivePersonGames + (1/6)*sixPersonGames;
  var sum = threePersonGames + fourPersonGames + fivePersonGames + sixPersonGames;
  return top / sum;
  
}


/**
 * Returns number of unique players that have played Settlers of Catan at the House.
 * @return The amount of unique players.
 * @customfunction
 */

function getTotalPlayerCount(){
  return getListOfPlayers().length;
}

/**
 * Gets the longest current win streak that any player(s) may achieve.
 * @param {player} player name will be searched and counted to tally a correct current win streak.
 * @return The current win streak length that {player} is on.
 * @customfunction
 */
function getLongestCurrentWinstreak(playerAmount){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var players = getListOfPlayers();
  
  var temp;
  var playerIndex
  var highestCurrentWS = 0;
  var result;
  var WSArray = []; //Win Streak Array
  //var WSPlayerIndexArray = []; // Win Streak Player Index used for formatting later //
  for(var i = 0; i < players.length; i++){
    temp = getCurrentWS(players[i]);
    if(temp > highestCurrentWS){
      highestCurrentWS = temp;
      playerIndex = i;
    }
  }
  //Looping though again to see if anyone else ties for the same longest win streak//
  WSArray.push(players[playerIndex]);
  for(var i = 0; i < players.length; i++){
    if(getCurrentWS(players[i]) == highestCurrentWS && players.length > 0 && players[i] != players[playerIndex]){ //Ensuring that the player is a different player from before
      WSArray.push(players[i]);
    }
  }
  
  //////////////////////
  function getCurrentWS(playerCell){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  //INITIALIZING VARIABLES
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var longestStreak = 0;
  var currentStreak = 0;
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  
  
  //LOOPING THRU TO GET WINSTREAK COUNT
  
  for(var i = 0; i < numOfGame; i++){
    if(wins[i] == playerCell){
      currentStreak++;
    }
    else if(wins[i] != playerCell && getLoss(playerCell, i) == 1){
      currentStreak = 0;
    }
  }
  
  function getLoss(playerCell, i){
    if(losses[i][0] == playerCell || losses[i][1] == playerCell || losses[i][2] == playerCell || losses[i][3] == playerCell || losses[i][4] == playerCell){
            return 1;                                                                                                                         
    }else{
          return 0;                                                                                                                           
    }
  }
    return currentStreak;
  }

  /////////////////////////////////////
  //RETURN FOR CURRENT LONGEST WINSTREAK
  
  //PRINTING OUT THE LONGEST CURRENT WIN STREAK//
  result = "";
    if(highestCurrentWS > 1){
      for(var i = 0; i < WSArray.length; i++){
        result = result + WSArray[i] + ", ";
      }
     result = result + highestCurrentWS+" Games";
  }else{
    for(var i = 0; i < WSArray.length; i++){
      result += players[playerIndex] + ", ";
    }
    result += highestCurrentWS+" Game";
  }
    
  return result;
}


//////////////////////////////////

function getLongestCurrentLossstreak(playerAmount){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var players = getListOfPlayers();
  
  var temp;
  var playerIndex
  var highestCurrentLS = 0;
  var result;
  var LSArray = []; //Loss Streak Array
  for(var i = 0; i < players.length; i++){
    temp = getCurrentLS(players[i]);
    if(temp > highestCurrentLS){
      highestCurrentLS = temp;
      playerIndex = i;
    }
  }
  //Looping though again to see if anyone else ties for the same longest loss streak//
  LSArray.push(players[playerIndex]);
  for(var i = 0; i < players.length; i++){
    if(getCurrentLS(players[i]) == highestCurrentLS && players.length > 0 && players[i] != players[playerIndex]){ //Ensuring that the player is a different player from before
      LSArray.push(players[i]);
    }
  }
  
  //////////////////////
  function getCurrentLS(playerCell){ //GETS LONGEST LOSSSTREAK FOR ACTIVE PLAYER
  //INITIALIZING VARIABLES
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var wins = sheet.getRange('B2:B').getValues(); //WINS COLUMN
  var losses = sheet.getRange('C2:G').getValues(); //LOSS ARRAY
  var currentStreak = 0;
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  
  //LOOPING THRU TO GET LOSSSTREAK COUNT
  
  for(var i = 0; i < numOfGame; i++){
    if(losses[i][0] == playerCell || losses[i][1] == playerCell || losses[i][2] == playerCell || losses[i][3] == playerCell || losses[i][4] == playerCell){
      currentStreak++;
    }
    else if(losses[i][0] != playerCell && losses[i][1] != playerCell && losses[i][2] != playerCell && losses[i][3] != playerCell && losses[i][4] != playerCell && wins[i] == playerCell){
      currentStreak = 0;
    }
  }
  
 return currentStreak; //RETURN FOR CURRENT LONGEST LOSSSTREAK
}
  //PRINTING OUT THE LONGEST CURRENT LOSS STREAK//
  result = "";
    if(highestCurrentLS > 1){
      for(var i = 0; i < LSArray.length; i++){
        result = result + LSArray[i] + ", ";
      }
     result = result + highestCurrentLS+" Games";
  }else{
    for(var i = 0; i < LSArray.length; i++){
      result += players[playerIndex] + ", ";
    }
    result += highestCurrentLS+" Game";
  }
    
  return result;
}
