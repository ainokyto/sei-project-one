function init() {

  // * DOM ELEMENTS ----------------------------------------------------------

  const startBtn = document.querySelector('.start')
  const resetBtn = document.querySelector('.reset')
  const scoreTally = document.querySelector('.actualscore')
  const playerAudio = document.querySelector('#playeraudio')
  const enemyAudio = document.querySelector('#enemyaudio')
  const finishContent = document.querySelector('.finishcontent')
  const startContent = document.querySelector('.startcontent')

  // * GAME VARIABLES ------------------------------------------------------

  const grid = document.querySelector('.grid')
  const width = 11
  const cellCount = width * width
  let cells = []
  let score = 0
  let direction = 1
  let gameRunning = false
  let invaderArray = [0, 1, 2, 3, 4, 5, 6, 7,
    11, 12, 13, 14, 15, 16, 17, 18,
    22, 23, 24, 25, 26, 27, 28, 29]
  let leadInvader = 0
  let playerPosition = 115
  let timerId = null
  let laserTimerId = null
  let enemyFireTimerId = null
  let firstRowTimerId = null
  // let isShooting = true


  // * START GAME --------------------------------------------------------

  function gameStart() {

    createGrid(playerPosition)
    createInvaders()
    startTimer()
    firstRowTimer()

    // * CREATE GRID AND PLAYER SPACESHIP -------------------------------------

    function createGrid(startingPosition) {
      for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        // cell.textContent = i
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

    //* INVADER MOVEMENT --------------------------------------------------------

    function moveInvaders() {
      removeInvaders()

      //* CHECK WHETHER INVADERS REACH THE BOTTOM ROW -----------------------------

      const dangerZone = [110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]
      const invadersInDangerZone = dangerZone.filter(index => invaderArray.includes(index))
      if (invadersInDangerZone.length > 0) {
        gameOver()
      }

      //* INVADER MOVEMENT LOGIC --------------------------------------------------

      if (leadInvader % width === 3 && direction === 1) {
        direction = width
      } else if (leadInvader % width === 3 && direction === width) {
        direction = -1
      } else if (leadInvader % width === 0 && direction === -1) {
        direction = width
      } else if (leadInvader % width === 0 && direction === width) {
        direction = 1
      }
      addInvaders()
      reachPlayer()
    }

    //* REMOVE INVADERS CLASS --------------------------------------------------

    function removeInvaders() {
      invaderArray.forEach(invader =>
        cells[invader].classList.remove('invaders'))
    }

    //* ADD INVADERS CLASS ------------------------------------------------------

    function addInvaders() { // draws the invaders back on their new position on the grid
      invaderArray = invaderArray.map(a => a + direction)
      leadInvader = leadInvader + direction
      invaderArray.forEach(invader => {
        cells[invader].classList.add('invaders')
      })
    }

    //* FUNCTION TO CHECK WHETHER INVADERS REACH PLAYER -------------------------

    function reachPlayer() {
      const playerCollision = invaderArray.some(invader => {
        return cells[invader].classList.contains('spaceship')
      })
      if (playerCollision) {
        gameOver()
      } return
    }

    //* GAME TIMER ------------------------------------------------------

    function startTimer() { // stop gameInit from starting multiple instances of the timer 
      // create a global variable for gameRunning and give it the value Boolean false
      // create a global variable for timer and give it the value 'null'
      if (!gameRunning) {  // make an if statement where if gameRunning = true, 
        timerId = setInterval(moveInvaders, 1200) //timerId is assigned the value of a timer starting moving invaders, 
        gameRunning = true // and gameRunning = true
      } else { // if gameRunning is false, timer will not start
        gameRunning = false
      }
    }

    //* ENEMY LASER TIMER --------------------------------------------------------
    function firstRowTimer() {
      // console.log('enemy laser shoot')
      firstRowTimerId = setInterval(checkFirstRow, 2000)
    }

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
          fireLaser()
          break
        default:
          playerPosition
      }
      cells[playerPosition].classList.add('spaceship')
    }

    //* FIRE AT INVADERS ----------------------------------------------------------------


    function fireLaser() {
      // limitLasers()
      playerAudio.src = './assets/meow.wav'
      playerAudio.play()

      //* LIMIT PLAYER TO ONE LASERBEAM PER COLUMN -------------------------------------------

      let laserIndex = playerPosition - width // laser starts at cell directly above player
      let newLaserIndex = laserIndex
      const columnArray = [] // empty array 

      for (let i = 1; i < width - 1; i++) { // push all same column cells into array  
        columnArray.push(newLaserIndex -= 11) //
      }

      const someContainLasers = columnArray.some(item => { // loop through column to find out
        return cells[item].classList.contains('laser') // whether any of the cells contain a live laser
      })

      if (!someContainLasers) { // if there are no lasers
        cells[laserIndex].classList.add('laser')
        laserTimerId = setInterval(laserAdvance, 100) // player may fire
      } else {
        console.log('you cant shoot!')
      }

      // limit user lasers to one live laser beam at a time
      // function limitLasers() {
      //   if (!isShooting) {
      //     laserTimerId = setInterval(laserAdvance, 100)
      //     isShooting = true
      //   } else {
      //     isShooting = false
      //   }
      // }

      //* MAKE LASER ADVANCE ACROSS THE GRID ----------------------------------------------------

      function laserAdvance() {
        cells[laserIndex].classList.remove('laser') // remove laser class
        if (laserIndex > width - 1) {
          laserIndex = laserIndex - width // finding the cell directly above current laserindex
          cells[laserIndex].classList.add('laser') // add class to new square
          if (laserIndex === width - width) { // stops at the grid
            // console.log('past grid!')
            clearInterval(laserTimerId)
            cells[laserIndex].classList.remove('laser')
          }
          
          //* COLLISION DETECTION ---------------------------------------------------------------

          if (cells[laserIndex].classList.contains('invaders')) { // If laser 'hits' invader
            clearInterval(laserTimerId) //stop timer
            cells[laserIndex].classList.remove('invaders', 'laser') // clear cell from both classes
            const killedInvader = invaderArray.indexOf(laserIndex) // locates the index of hit invader
            invaderArray.splice(killedInvader, 1)
            score += 1000
            scoreTally.innerHTML = score
            enemyAudio.src = './assets/zap.wav'
            enemyAudio.play()
            if (invaderArray.length === 0) {
              youWin()
            }
          }
        }
      }
    }

    // LEVEL UP FUNCTION
    // function levelUp() {
    //   invaderArray = [0, 1, 2, 3, 4, 5, 6, 7,
    //     11, 12, 13, 14, 15, 16, 17, 18,
    //     22, 23, 24, 25, 26, 27, 28, 29]
    //   leadInvader = 0
    //   createInvaders()
    //   clearInterval(timerId)
    //   clearInterval(enemyFireTimerId)
    //   timerId = setInterval(moveInvaders, 2000)
    // }




    //* CHOOSE A RANDOM INVADER FROM FIRST ROW AND FIRE ENEMY LASER ---------------------------------------------------------
    function checkFirstRow() {
      // audio.src = '../assets/laser.wav'
      // audio.play()
      const randomInvader = Math.floor(Math.random() * invaderArray.length) // get random number from the array length
      // console.log(randomInvader)
      let enemyLaserStart = invaderArray[randomInvader] + width // get cell directly below random invader
      // console.log(enemyLaserStart)
      if (!cells[enemyLaserStart].classList.contains('invaders')) { // if random invader is on first row
        cells[enemyLaserStart].classList.add('enemy') // start laser here
      } else if (!cells[enemyLaserStart + width].classList.contains('invaders')) { // if random invader is on second row
        cells[enemyLaserStart].classList.add('enemy') // start laser here
      } else {
        cells[enemyLaserStart + width + width].classList.add('enemy')
      }

      enemyFire()
      enemyFireTimerId = setInterval(enemyFire, 250)

      //* ENEMY LASER ADVANCE ACROSS THE GRID -------------------------------------------------------

      function enemyFire() {
        cells[enemyLaserStart].classList.remove('enemy') // remove enemy laser class
        if (enemyLaserStart <= 109) { // stop at the bottom
          enemyLaserStart += width // make laser move down
          cells[enemyLaserStart].classList.add('enemy')
          if (cells[enemyLaserStart].classList.contains('spaceship')) {
            gameOver()
          }
        } else {
          clearInterval(enemyLaserStart)
        }
      }
    }

    function gameOver() {
      document.removeEventListener('keydown', handleKeyDown)
      startBtn.removeEventListener('click', firstRowTimer)
      startContent.style.display = 'none'
      finishContent.textContent = `Game over! Your score is: ${score}`
      playerAudio.src = './assets/death.wav'
      playerAudio.play()
      gameRunning = false
      startBtn.style.display = 'initial'
      resetBtn.style.display = 'initial'
      

      clearInterval(timerId)
      clearInterval(laserTimerId)
      clearInterval(enemyFireTimerId)
      clearInterval(firstRowTimerId)
      for (let i = 0; i < 1000; i++) {
        clearInterval(i)
      }
      clearGrid()
    }

    function youWin() {
      document.removeEventListener('keydown', handleKeyDown)
      startBtn.removeEventListener('click', firstRowTimer)
      startContent.style.display = 'none'
      finishContent.textContent = `You Win! Your score is: ${score}`
      playerAudio.src = './assets/death.wav'
      playerAudio.play()
      gameRunning = false
      startBtn.style.display = 'initial'
      resetBtn.style.display = 'initial'
      

      clearInterval(timerId)
      clearInterval(laserTimerId)
      clearInterval(enemyFireTimerId)
      clearInterval(firstRowTimerId)
      for (let i = 0; i < 1000; i++) {
        clearInterval(i)
      }
      clearGrid()
    }


    function clearGrid() { // resetting variables for game restart
      grid.innerHTML = ''
      score = 0
      scoreTally.textContent = ''
      cells = []
      invaderArray = [0, 1, 2, 3, 4, 5, 6, 7,
        11, 12, 13, 14, 15, 16, 17, 18,
        22, 23, 24, 25, 26, 27, 28, 29]
      leadInvader = 0
      direction = 1
      playerPosition = 115
    }

    document.addEventListener('keydown', handleKeyDown)
    startBtn.addEventListener('click', firstRowTimer)
    resetBtn.addEventListener('click', firstRowTimer)
    
  }

  //* FUNCTION TO START GAME ---------------------------------------------------

  function handleStartBtn() {
    gameStart()
    finishContent.textContent = ''
    startContent.style.display = 'initial'
    startBtn.style.display = 'none'
    resetBtn.style.display = 'none'
    event.target.blur()
  }

  startBtn.addEventListener('click', handleStartBtn)
  resetBtn.addEventListener('click', handleStartBtn)

}

window.addEventListener('DOMContentLoaded', init)