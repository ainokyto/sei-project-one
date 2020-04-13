function init() {
  // * DOM ELEMENTS ----------------------------------------------------------

  const startBtn = document.querySelector('.start')
  const resetBtn = document.querySelector('.reset')
  const score = document.querySelector('.actualscore')

  // * GAME VARIABLES ------------------------------------------------------
  let direction = 1
  let gameRunning = false
  let invaderArray = [0, 1, 2, 3, 4, 5, 6, 7,
    11, 12, 13, 14, 15, 16, 17, 18,
    22, 23, 24, 25, 26, 27, 28, 29]
  let playerPosition = 115
  let timerId = null
  const grid = document.querySelector('.grid')
  const cells = []
  const width = 11
  const cellCount = width * width

  //* // * START GAME --------------------------------------------------------

  function gameInit() {

    // * CREATE GRID AND PLAYER SPACESHIP -------------------------------------

    function createGrid(startingPosition) {
      for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        cell.textContent = i
        grid.appendChild(cell)
        cells.push(cell)
      }
      cells[startingPosition].classList.add('spaceship')
    }
    // * CREATE INVADERS ON GRID ----------------------------------------------

    function createInvaders() {
      invaderArray.forEach(invader =>
        cells[invader].classList.add('invaders'))
    }
    //* INVADER MOVEMENT ------------------------------------------------------
    // in the if statement, -1 moves left, width down

    // game starts with invaders moving right
    // function removeAliens - remove classes
    // function addAliens - based on the direction(1) variable


    function moveInvaders() {
      removeInvaders()
      if (invaderArray[0] % width === 3 && direction === 1) {
        direction = width
      } else if (invaderArray[0] % width === 3 && direction === width) {
        direction = -1
      } else if (invaderArray[0] % width === 0 && direction === -1) {
        direction = width
      } else if (invaderArray[0] % width === 0 && direction === width) {
        direction = 1
      } else if (invaderArray[0] > width * width - width) {
        gameOver()
      }
      addInvaders()
    }

    //* REMOVE INVADERS CLASS --------------------------------------------------
    function removeInvaders() {
      invaderArray.forEach(invader =>
        cells[invader].classList.remove('invaders'))
    }

    //* ADD INVADERS CLASS ------------------------------------------------------
    function addInvaders() {
      invaderArray = invaderArray.map(a => a + direction)
      invaderArray.forEach(invader => {
        cells[invader].classList.add('invaders')
      })
    }

    //* START GAME TIMER
    
    function startTimer () {
      // GLOBAL SCOPE let gameRunning = true // set a variable true when you create the premise,
      if (!gameRunning) { 
        timerId = setInterval(moveInvaders, 1000) 
        gameRunning = true //have completion of the premise set the variable false,
      } else {
        gameRunning = false  // don't create another instance of the premise if the variable is true.
      } 
    }
    startTimer()

    //* PLAYER SPACESHIP MOVEMENT ---------------------------------------------

    function handleKeyDown(event) {
      cells[playerPosition].classList.remove('spaceship')
      switch (event.keyCode) {
        case 39:
          playerPosition < 120 ? playerPosition++ : playerPosition
          break
        case 37:
          playerPosition > 110 ? playerPosition-- : playerPosition
          break
        case 32:
          console.log('I am the space bar')
          break
        default:
          playerPosition
      }
      cells[playerPosition].classList.add('spaceship')
    }

    //* CREATE FUNCTION TO FIRE AT INVADERS
 
    

    //* event spacebar
    //* playerposition - width the starting cell that advances up on the grid
    //* index decrementing by width  
    //* class is being removed from the current cell and added on to the next cell

    function gameOver() {
      gameRunning = false
      console.log(gameRunning)
      clearInterval(timerId)
    }


    createGrid(playerPosition)
    createInvaders()
    document.addEventListener('keydown', handleKeyDown)

  }

  //* FUNCTION TO START GAME ---------------------------------------------------

  function handleStartBtn() {
    gameInit()
  }

  startBtn.addEventListener('click', handleStartBtn)
  resetBtn.addEventListener('click', gameInit)

}

window.addEventListener('DOMContentLoaded', init)