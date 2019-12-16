/**
 * Settlers Of Catan Leaderboard Sorting and Ranking Scripts
 * @Author: Ethan Horvath
 * @Date Started: November 6th, 2019
 */

 /*****************************************************************
 * IF YOU LIVE IN HOUSE AND CAN ACCESS THIS DO NOT TOUCH ANYTHING *
 *****************************************************************/
/**
 * settlersOfCatan()
 * Main Method that runs main stat sheet. Theses value all represent certain stats displayed on the main spreadsheet.
 * @param {playerAmount} This is used to auto update the script everytime a game is ran because Google Scripts will auto refresh scripts when a parameter has updated from a previous form.
 * @return {stats} The main array that holds all of the data for all of the players that have played Settlers of Catan at The House.
 * @customfunction
 */
function settlersOfCatan(playerAmount){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var games = sheet.getRange('B2:G').getValues(); //GAMES ARRAY [][]
  var nOG = sheet.getRange('I3'); //NUM OF GAMES
  var numOfGame = nOG.getValue();
  var players = getListOfPlayers(); //Array that holds all of the player's names
  var stats = [];
  
  for(var i = 0; i < players.length; i++){ //For Loop that prints out all the game stats and data.
   stats[i] = [players[i], getTotalWins(players[i]), getTotalGames(players[i]), getTotalWins(players[i]) / getTotalGames(players[i]), getIdealWR(players[i]), getLongestWinstreak(players[i]), getLongestLossstreak(players[i])];
  }
  
  return stats;
      
}
/**
 * getTotalGames()
 * Gets total number of games that the player has played in
 * @param {player} Which user to count games for
 * @return {numOfGamesPlayed} Amount of games that player participated in.
 * @customfunction
 */
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
/**
 * getTotalWins()
 * Gets total number of wins that the player has achieved
 * @param {player} Which user to count wins for
 * @return {numOfWin} Amount of games that player won.
 * @customfunction
 */
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
  
  if(player == "Ethan") //Unforunately due to a penatly from Johnny Kret forfeiting a match, this is the lazy way to give me a win since Max technically has the win counted since there is no condition for a tie in Settlers of Catan.
    numOfWins++;
  
  return numOfWins;
}     
/**
 * getListOfPlayers()
 * Function that gets lists of players, only adds a player to the list if they haven't played before.
 * @return {players} Array that holds all of the names of the players that have played.
 * @customfunction
 */
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
/**
 * getLongestLossstreak()
 * Gets longest lossstreak stat for a player.
 * @param {playerCell} Player to count longest lossstreak for.
 * @return {longestStreak} Longest lossstreak.
 * @customfunction
 */
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
/**
 * getLongestWinstreak()
 * Gets longest winstreak stat for a player.
 * @param {playerCell} Player to count longest winstreak for.
 * @return {longestStreak} Longest winstreak.
 * @customfunction
 */
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
/**
 * getIdealWR()
 * Gets the ideal win rate for a player. This takes into account if a player played in a 
 * game with 4 players, each player of all equal skill should have a 25% win rate.
 * 1 / Number of Players = WR. Add this up for every game a player has been in,
 * and then take an average.
 * @param {playerCell} Player to get ideal win rate for.
 * @return Ideal Win Rate.
 * @customfunction
 */
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
 * getTotalPlayerCount()
 * Returns number of unique players that have played Settlers of Catan at the House.
 * @param {playerAmount} This is used to auto update the script everytime a game is ran because Google Scripts will auto refresh scripts when a parameter has updated from a previous form.
 * @return The amount of unique players.
 * @customfunction
 */

function getTotalPlayerCount(playerAmount){
  return getListOfPlayers().length;
}

/**
 * getLongestCurrentWinstreak()
 * Gets the longest current winstreak that any player(s) may achieve.
 * @param {playerAmount} All player names will be searched and counted to tally a correct current winstreak. Only the highest champions will be shown with their score
 * @return {result} The current winstreak string with player(s) and game amount.
 * @customfunction
 */
function getLongestCurrentWinstreak(playerAmount){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var players = getListOfPlayers();
  
  var temp;
  var playerIndex //VERY IMPORTANT Variable to keep track of the original player index to ensure that the player is not repeated when checking for any other repeat achievers.
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


/**
 * getLongestCurrentLossstreak()
 * Gets the longest current lossstreak that any player(s) may achieve.
 * @param {playerAmount} All player names will be searched and counted to tally a correct current lossstreak. Only the highest champions will be shown with their score
 * @return {result} The current lossstreak string with player(s) and game amount.
 * @customfunction
 */
function getLongestCurrentLossstreak(playerAmount){ //GETS LONGEST WINSTREAK FOR ACTIVE PLAYER
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var losses = sheet.getRange('C3:G').getValues(); //LOSS ARRAY
  var wins = sheet.getRange('B3:B').getValues(); //WINS COLUMN
  var players = getListOfPlayers();
  
  var temp;
  var playerIndex //VERY IMPORTANT Variable to keep track of the original player index to ensure that the player is not repeated when checking for any other repeat achievers.
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
