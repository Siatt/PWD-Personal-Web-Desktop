const template = document.createElement('template')
template.innerHTML = `
<style>
  #text {
    width: 350px;
    height: 350px;
    background-color: yellow;
    padding: 0px;
    margin: 0px;
  }
  .board {
    display:block;
    width: 340px;
    height: 340px;
    padding: 5px;
    margin: 0 auto;
    background-color: white;
    opacity: 1.0;
  }
  .removed {

  }
  p {
    display:inline;
    float:none;
    margin-top: 20px;
    margin: 0 0 0 5px;
    padding-bottom: 5px;
  }
  .menu {
    height: 20px;
    width: 100%;
    background-color: black;
    color: white;
    opacity: 0.95;
    border-bottom: solid 1px white;
  }
  .img {
    width: 24px;
    height: 24px;
  }
  #restart:hover {
    color: orangered;
    cursor:pointer;
  }
</style>
<div class="menu">
<p id="time">Time: 0</p>
<p id="tries">Tries: 0</p>
<p id="restart">Restart</p>
</div>
<div class= "board">
  
</div>
`
/**
 * Represents a memory game
 * @class Board
 */
class Board extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    // TODO: this container är en egen container i shadow domen bredd 350px höjd 350px
    this.container = this.shadowRoot.querySelector('.board')// document.querySelector('.window #content')
    this.restart = this.shadowRoot.querySelector('#restart')
    this.tiles = []
    this.turn1 = null
    this.turn2 = null
    this.lastTile = null
    this.timer = null
    this.parent = null
    this.pairs = 0
    this.tries = 0
    this.time = 0
  }
  connectedCallback () {
    // Save parentnode for append new game
    this.parent = this.parentNode

    this.restart.addEventListener('click', event => this.restartApp())
    this._makeBoard(4, 4)
    this.timer = setInterval(() => {
      this.shadowRoot.querySelector('#time').textContent = `Time: ${this.time++}`
    }, 1000)
  }
  /**
   * Restarts app
   * @memberof Board
   */
  restartApp () {
    this.remove()
    let newGame = document.createElement('memory-board')
    this.parent.appendChild(newGame)
  }
  /**
   *  Creates the memory board
   * @param {number} rows Number of row
   * @param {number} cols Number of cols
   * @memberof Board
   */
  _makeBoard (rows, cols) {
    let brickTemplate = document.querySelectorAll('#memory-template')[0].content.firstElementChild
    let a
    this._shuffle(rows, cols)

    this.tiles.forEach((tile, index) => {
      a = document.importNode(brickTemplate, true)

      this.container.appendChild(a)

      a.addEventListener('click', event => {
        let img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
        this._turnBrick(tile, index, img, rows, cols)
        event.stopPropagation()
        console.log(event.target)
      })

      if ((index + 1) % cols === 0) {
        this.container.appendChild(document.createElement('br'))
      }
    })
  }
  /**
   * Handels the the turning of bricks and game logic
   * @param {object} tile Tile
   * @param {number} index index of tile
   * @param {Object} img img of tile
   * @param {number} rows Number of rows
   * @param {number} cols Number of cols
   * @memberof Board
   */
  _turnBrick (tile, index, img, rows, cols) {
    if (this.turn2) return

    img.src = 'image/' + tile + '.png'

    if (!this.turn1) {
      this.turn1 = img
      this.lastTile = tile
      return null
    } else {
      // Second tile clicked
      if (img === this.turn1) return
      this.turn2 = img
      this.tries++
      this.shadowRoot.querySelector('#tries').textContent = `Tries: ${this.tries}`
      if (this.lastTile === tile) {
        this.pairs++
        if (this.pairs === (cols * rows) / 2) {
          clearInterval(this.timer)
          console.log('won' + 'tries' + this.tries)
        }

        setTimeout(() => {
          console.log('pair')
          this.turn1.parentElement.classList.add('removed')
          this.turn2.parentElement.classList.add('removed')

          this.turn1 = null
          this.turn2 = null
        }, 500)
      } else {
        setTimeout(() => {
          this.turn1.src = 'image/0.png'
          this.turn2.src = 'image/0.png'

          this.turn1 = null
          this.turn2 = null
        }, 500)
      }
    }
  }
  /**
   * Shuffels the board tiles
   * @param {number*} rows Number of row
   * @param {number} cols Number of cols
   * @memberof Board
   */
  _shuffle (rows, cols) {
    let arr = []
    for (let i = 1; i <= (rows * cols) / 2; i++) {
      arr.push(i)
      arr.push(i)
    }
    // Shuffle
    arr.sort((a, b) => Math.floor(Math.random() * 3 - 1))
    this.tiles = arr
    return this.tiles
  }
}
window.customElements.define('memory-board', Board)
module.exports = Board
