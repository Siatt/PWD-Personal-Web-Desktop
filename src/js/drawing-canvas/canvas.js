const template = document.createElement('template')
template.innerHTML = `
<style> 
    canvas {
        display:block;
        margin: 0 auto;
        background-color: white;
    }
    .menu {
        height: 25px;
        width: 100%;
        background-color: grey;
        color: white;
        opacity: 0.95;
        border-bottom: solid 1px white;
      }   
      ul {
          margin: 0 0 0 5px;
          padding: 0px;
          display: flex;
          align-items: center;
          list-style-type: none;
      }
      li {
         margin: 0 0 0 5px;
      }
      .color {
          height:15px;
          width:15px;
          border-radius:50%;
          display:inline-block;
          border: 2px solid grey;
      }
      .selected {
        border: 2px solid white;
      }
</style>
<div class="menu">
    <ul>
    </ul>
</div>
<canvas  height="400" width="460">
</canvas>
`
/**
 * Represents a drawable canvas
 * @class Canvas
 */
class Canvas extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.canvas = this.shadowRoot.querySelector('canvas')
    this.colorMenu = this.shadowRoot.querySelector('.menu ul')
    this.ctx = this.canvas.getContext('2d')
    this.colors = ['black', 'red', 'yellow', 'green', 'brown', 'blue']
    this.radius = 3
    this.ctx.lineWidth = 6
    this.selectedColor = null
    this.drawing = false
    console.log(this.canvas)
  }
  connectedCallback () {
    this.addColorBalls()
    this.canvas.addEventListener('mousedown', event => this.checkDragging(event))
    this.canvas.addEventListener('mouseup', event => this.checkDragging(event))
    this.canvas.addEventListener('mousemove', event => this.startDrawing(event))
  }
  /**
   * Starts to draw on canvas
   * @param {object} event mousemove event
   * @memberof Canvas
   */
  startDrawing (event) {
    if (this.drawing) {
      this.ctx.fillStyle = this.selectedColor
      this.ctx.strokeStyle = this.selectedColor
      this.ctx.lineTo(event.offsetX, event.offsetY)
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.arc(event.offsetX, event.offsetY, this.radius, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.beginPath()
      this.ctx.moveTo(event.offsetX, event.offsetY)
    }
  }
  /**
   * Checks if mouse if down or up
   * @param {object} event mouse event
   * @memberof Canvas
   */
  checkDragging (event) {
    this.drawing = event.type === 'mousedown'
    if (!this.drawing) {
      this.ctx.beginPath()
    }
  }
  /**
   * Adds color pallets to canvas
   * @memberof Canvas
   */
  addColorBalls () {
    let frag = document.createDocumentFragment()
    for (let i = 0; i < this.colors.length; i++) {
      let div = document.createElement('div')
      div.classList.add('color')
      div.addEventListener('click', event => this.selectColor(event))
      div.style.backgroundColor = this.colors[i]

      let li = document.createElement('li')

      li.appendChild(div)
      frag.appendChild(li)
    }
    this.colorMenu.appendChild(frag)
  }
  selectColor (event) {
    this.selectedColor = event.target.style.backgroundColor
  }
}
window.customElements.define('drawing-canvas', Canvas)
module.exports = Canvas
