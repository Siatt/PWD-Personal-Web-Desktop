require('./BasicWindow')
/**
 * Class handling clicks on the desktop
 *
 * @class Desktop
 */
class Desktop {
  constructor () {
    this.zIndex = 0
  }
  /**
   * Initilaze the eventlistener
   * @memberof Desktop
   */
  init () {
    window.addEventListener('mousedown', event => this.handleClick(event))
  }

  /**
   * Handels click on desktop and check if click is on window
   * @memberof Desktop
   */
  handleClick (event) {
    let target = event.target.getAttribute('value') === 'win'
    if (target) this.setFocus(event.target)
  }
  /**
   * Sets focus on element clicked
   * @param {object} element Element clicked
   * @memberof Desktop
   */
  setFocus (element) {
    this.zIndex++
    element = element.shadowRoot.querySelector('.window')
    element.style.zIndex = this.zIndex
  }
}
module.exports = Desktop
