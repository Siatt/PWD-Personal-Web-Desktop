require('./memory/memory-board')
const template = document.createElement('template')
template.innerHTML = `
<style>
  .window {
    height: 400px;
    min-width: 350px;
    position: absolute;
  }
  .window .window-top {
    width: 100%;
    height: 32px;
    background-color: black;
    color: white;
    opacity: 0.95;
    cursor: pointer;
  }
  .window .window-menu {
    height: 20px;
    width: 100%;
    background-color: black;
    color: white;
    opacity: 0.95;
    border-bottom: solid 1px white;
  }
  .window-top p {
    display: inline;
    margin-left: 5px;
    margin-right: 10px;
  }
  p img {
    margin-top: 8px;
  }
  .window .content {
    position: relative;
    bottom: 0px;
    height: calc(100% - 52px);
    width: 100%;
    background-color: black;
  }
  .window .window-btn {
    height: 35px;
    float: right;
  }
  div {
    display: block;
  }
</style>
<div class="window">
<div class="window-top">
    <p></p>
    <p></p>
    <div class="window-btn">
        <p style="font-size: 24px;">—</p>
        <p style="font-size: 24px;">X</p>
    </div>
</div>
<div id="content" class="content">

</div>
</div>
`
/**
 * Represents a basic window
 * @class BasicWindow
 */
class BasicWindow extends window.HTMLElement {
  constructor (x, y, title, id) {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.x = this.shadowRoot.querySelector('.window-btn').childNodes[3]
    this.tab = this.shadowRoot.querySelector('.window')
    this.element = null
  }
  connectedCallback () {
    this.drag(this.tab)
    // Removes window
    this.x.addEventListener('click', event => this.remove())
  }
  /**
   * Handee
   * @param {object} tab Window in DOM
   * @memberof BasicWindow
   */
  drag (tab) {
    let arr = [0, 0, 0, 0]
    let windowTop = this.shadowRoot.querySelector('.window-top')
    windowTop.onmousedown = handleDrag
    /**
     * Handels the drag events
     */
    function handleDrag () {
      arr[2] = tab.clientX
      arr[3] = tab.clientY
      document.onmousemove = tabMove
      document.onmouseup = tabCancelMove
    }
    /**
     * Moves the window
     * @param {object} pos event
     */
    function tabMove (pos) {
      arr[0] = arr[2] - pos.clientX
      arr[1] = arr[3] - pos.clientY
      arr[2] = pos.clientX
      arr[3] = pos.clientY

      tab.style.top = (tab.offsetTop - arr[1]) + 'px'
      tab.style.left = (tab.offsetLeft - arr[0]) + 'px'
    }
    /**
     * Removes events
     */
    function tabCancelMove () {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
window.customElements.define('basic-window', BasicWindow)
module.exports = BasicWindow
