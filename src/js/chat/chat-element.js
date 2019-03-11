const template = document.createElement('template')
template.innerHTML = `
<style>
  .chat {
    display:block;
    width: 350px;
    height: 260px;
    padding: 0px;
    margin: 0 auto;
    background-color: white;
    overflow-y:auto;
    overflow-x: hidden;
    word-wrap:break-word;
    font-size: 12px;
  }
  .typeArea {
    width: 350px;
    height: 70px;
  }
  textarea {
      width:350px;
      height:60px;
      border-top: 3px solid grey;
      border-left: 0;
      border-bottom: 0;
      border-right: 0;
      resize: none;
      position:absolute;
  }
  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid grey;
    margin: 1em 0;
    padding: 0; 
    }
  .username {
      display:block;
      width:350px;
      height:90px;
      z-index:2;
      position:absolute;
  }
  .button {
      position: absolute;
      bottom: 0px;
      width: 350px;
      height: 30px;
      border:none;
      background-color: black;
      color: white;
  }
  .button:hover {
    background-color: orangered;
    cursor:pointer;
  }
  .menu {
    height: 20px;
    width: 100%;
    background-color: #0A0A0A;
    opacity: 0.95;
    color: white;
    border-bottom: solid 1px white;
  }
  .menu p {
    display:inline;
    float:none;
    margin-top: 20px;
    margin: 0 0 0 5px;
    padding-bottom: 5px;
  }
  .menu p:hover {
    color: orangered;
    cursor:pointer;
  }


</style>
<div class="menu" id="changeName"><p>Change Name</p></div>
<div class="chat">
</div>
<div class="typeArea">
    <div class="username">
    <textarea style="height:60px;" id="uidText" rows="1" cols="1" placeholder="Enter Username"></textarea>
    <input style="z-index:4;" id="uidBtn" type="button" class="button" value="Send username"> 
    </div>
    <textarea id="msgText" rows="4" cols="50"></textarea>
    <input id="msgBtn" type="button" class="button" value="Send"> 
</div>
`
/**
 * Represents a chat application
 * @class Chat
 */
class Chat extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.messageContainer = this.shadowRoot.querySelector('.chat')
    this.uidBtn = this.shadowRoot.querySelector('#uidBtn')
    this.msgBtn = this.shadowRoot.querySelector('#msgBtn')
    this.uidText = this.shadowRoot.querySelector('#uidText')
    this.msgText = this.shadowRoot.querySelector('#msgText')
    this.changeName = this.shadowRoot.querySelector('#changeName')
    this.usernameDiv = this.shadowRoot.querySelector('.username')
  }
  connectedCallback () {
    this.checkUserName()
    this.openWebSocket()
    this.uidBtn.addEventListener('click', event => this.setUserName())
    this.msgBtn.addEventListener('click', event => this.sendMessage(event))
    this.changeName.addEventListener('click', event => this.changeUsername())
  }
  disconnectedCallback () {
    this._socket.close()
    this.msgBtn.removeEventListener('click', event => this.sendMessage(event))
    this.changeName.removeEventListener('click', event => this.changeUsername())
  }
  /**
   * Change users chat name
   * @memberof Chat
   */
  changeUsername () {
    this.usernameDiv.style.visibility = 'visible'
  }
  /**
   * Checks if username already exits since before
   * @memberof Chat
   */
  checkUserName () {
    let localUsername = JSON.parse(window.localStorage.getItem('Username'))
    if (localUsername) {
      this.usernameDiv.style.visibility = 'hidden'
      this.uidBtn.removeEventListener('click', event => this.setUserName(event))
      this._chatObj.username = localUsername
    }
  }
  /**
   * Sets the username
   * @memberof Chat
   */
  setUserName () {
    let username = this.uidText.value
    if (username) {
      window.localStorage.setItem('Username', JSON.stringify(this.uidText.value))
      this._chatObj.username = this.uidText.value

      this.usernameDiv.style.visibility = 'hidden'
      this.uidBtn.removeEventListener('click', event => this.setUserName(event))
    } else {
      this.uidText.setAttribute('placeholder', 'No username found, Enter username')
    }
  }
  /**
   * Sends user message
   * @param {object} event mouse event
   * @memberof Chat
   */
  sendMessage (event) {
    if (this.msgText.value) {
      this._chatObj.data = this.msgText.value
      this._socket.send(JSON.stringify(this._chatObj))
      this.msgText.value = ''
    }
  }
  /**
   * Recives and parses messages
   * @memberof Chat
   */
  openWebSocket () {
    this._socket.addEventListener('message', event => {
      let message = JSON.parse(event.data)
      this.addMessage(message)
    })
  }
  /**
   * Adds chat messages to the DOM
   * @param {String} message Chat message from someone
   * @memberof Chat
   */
  addMessage (message) {
    if (message.type !== 'heartbeat') {
      let p = document.createElement('p')
      p.textContent = `${message.username}: ${message.data}`
      this.messageContainer.appendChild(p)
    }
  }
}
window.customElements.define('chat-element', Chat)
module.exports = Chat
