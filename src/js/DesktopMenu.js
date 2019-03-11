/**
 * Represents a desktop menu
 * @class DesktopMenu
 */
class DesktopMenu {
  constructor () {
    this.dateFormat = {year: 'numeric', month: 'numeric', day: 'numeric'}
    this.timeFormat = {hour: '2-digit', minute: '2-digit'}
  }
  /**
   * Initilize the class
   * @memberof DesktopMenu
   */
  init () {
    setInterval(() => { this.updateClock() }, 1000)
    let li = document.querySelectorAll('ul li')
    li.forEach(current => {
      current.addEventListener('click', event => this.handleClick(event))
    })
  }
  /**
   * Updates clock
   * @memberof DesktopMenu
   */
  updateClock () {
    let date = new Date()

    let currentDate = date.toLocaleDateString('sv-se', this.dateFormat)
    let currentTime = date.toLocaleTimeString('sv-se', this.timeFormat)

    let dateElem = document.querySelector('.date')
    let timeElem = document.querySelector('.time')

    dateElem.textContent = currentDate
    timeElem.textContent = currentTime
  }
  /**
   * Handels click and opens right app depending on click target
   * @param {object} event mouse event
   * @memberof  DesktopMenu
   */
  handleClick (event) {
    switch (event.target.getAttribute('value')) {
      case 'Memory':
        // Creats the window
        this.win = document.createElement('basic-window')
        document.querySelector('#container').appendChild(this.win)

        // Creates the application to appen to window
        this.app = document.createElement('memory-board')
        this.win.shadowRoot.querySelector('#content').appendChild(this.app)
        this.win.setAttribute('value', 'win')

        // Adds icon and title
        this.img = this.win.shadowRoot.querySelector('.window-top').childNodes[1]
        this.img.innerHTML = '<img src="image/memory-mini.png" alt="memory">'
        this.title = this.img.nextSibling
        this.title.textContent = 'Memory'
        break
      case 'Chat':

        this.win = document.createElement('basic-window')
        document.querySelector('#container').appendChild(this.win)

        this.app = document.createElement('chat-element')
        this.win.shadowRoot.querySelector('#content').appendChild(this.app)
        this.win.setAttribute('value', 'win')

        this.img = this.win.shadowRoot.querySelector('.window-top').childNodes[1]
        this.img.innerHTML = '<img src="image/chat_icon-mini.png" alt="memory">'
        this.title = this.img.nextSibling
        this.title.textContent = 'Chat'
        break
      case 'Canvas':

        this.win = document.createElement('basic-window')
        document.querySelector('#container').appendChild(this.win)

        this.app = document.createElement('drawing-canvas')
        this.win.shadowRoot.querySelector('#content').appendChild(this.app)
        this.win.setAttribute('value', 'win')

        this.img = this.win.shadowRoot.querySelector('.window-top').childNodes[1]
        this.img.innerHTML = '<img src="image/canvas-mini.png" alt="memory">'
        this.title = this.img.nextSibling
        this.title.textContent = 'Canvas'
    }
  }
}
module.exports = DesktopMenu
