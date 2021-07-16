animationDelay = 100;
minSearchTime = 1;

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
  if(localStorage["gameSave"]!="null"){
  }
  else
  {
  }
});
