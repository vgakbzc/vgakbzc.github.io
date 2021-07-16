function HTMLActuator() {
  this.tileContainer    = document.getElementsByClassName("tile-container")[0];
  this.scoreContainer   = document.getElementsByClassName("score-container")[0];
  this.bestContainer   = document.getElementsByClassName("best-container")[0];
  this.messageContainer = document.getElementsByClassName("game-message")[0];
  this.sharingContainer = document.getElementsByClassName("score-sharing")[0];

  this.score = 0;
  this.best  = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });
    
    //console.log(metadata);
    minSearchTime = Math.ceil(Math.log(metadata.score)/Math.log(2)*9.2);
    if(minSearchTime<1) minSearchTime=1;
    self.updateScore(metadata);

    if (metadata.over) self.message(false); // You lose
    if (metadata.won) self.message(true); // You win!
  });
};

HTMLActuator.prototype.restart = function () {
  if (ga) ga("send", "event", "game", "restart");
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var element   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];
  this.applyClasses(element, classes);
  
  var isActualValue = (localStorage['65536AI_ActualValue'] == 'true');
    
  var txt = {
    "1":"1",
    "2":"CE",
    "4":'<i class="fa fa-spin fa-circle-o-notch"></i>',
    "8":"RE",
    "16":"TLE",
    "32":"MLE",
    "64":"ILE",
    "128":"OLE",
    "256":"UKE",
    "512":"WA",
    "1024":"PC",
    "2048":"AC",
    "4096":"PE",
    "8192":"DoJ",
    "16384":"SJE",
    "32768":"AU",
    "65536":"AK",
    "-1":"#",
    "-2":"O2",
    "-4":"O3"
  };
  if(isActualValue) {
    for(i in txt) {
      var ch = "" + i;
      if(i < 0) ch = "×" + (-i);
      if(i > 9999) txt[i] = '<span style="font-size:0.7em">' + ch + '</span>';
      else if(i > 999) txt[i] = '<span style="font-size:0.9em">' + ch + '</span>';
      else if(i > 99) txt[i] = '<span style="font-size:1.1em">' + ch + '</span>';
      else txt[i] = '<span style="font-size:1.2em">' + ch + '</span>';
    }
  }
  element.innerHTML = txt[tile.value]?txt[tile.value]:tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(element, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(element, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(element, classes);
  }

  // Put the tile on the board
  this.tileContainer.appendChild(element);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  //console.info("UpdateScore: ");
  //console.info(this);
  this.clearContainer(this.scoreContainer);

  var difference = score.score - this.score;
  this.score = score.score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
  
  //setBest
  this.clearContainer(this.bestContainer);

  difference = score.best - this.best;
  this.best = score.best;

  this.bestContainer.textContent = this.best;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "=" + this.best;

    this.bestContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You AK IOI!" : "AFO"

  // if (ga) ga("send", "event", "game", "end", type, this.score);

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  //this.clearContainer(this.sharingContainer);
  //this.sharingContainer.appendChild(this.scoreTweetButton());
  twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won", "game-over");
};

HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://localhost:1/share");
  tweet.setAttribute("data-via", "gabrielecirulli");
  tweet.textContent = "Tweet";

  var text = "I scored " + this.score + " points at 65536, a game where you " +
             "join numbers to score high! #65536game #65536ai";
  tweet.setAttribute("data-text", text);

  return tweet;
};


HTMLActuator.prototype.showHint = function(hint) {
  document.getElementById('feedback-container').innerHTML = ['↑','→','↓','←'][hint];
}

HTMLActuator.prototype.setRunButton = function(message) {
  document.getElementById('run-button').innerHTML = message;
}
