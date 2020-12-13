var sockets = []

exports.makeP2P = ({ socket, socketClient }) => {
  return Object.freeze({
    listen,
    getConnectedPeers,
    sendEventByName
  })

  async function listen(server){
    const wss = socket(server)
    wss.on("connection", (socket) => socketConnected(socket))
    wss.on("error", (error) => console.log(`Error in ws server: ${error}`))
  }

  async function socketConnected(socket){
    sockets.push(socket)
    eventListeners(socket)
    console.log(`New socket connected: ${socket.id}`)
  }

  async function socketDisconnected(socket){
    sockets = sockets.filter(s => s.id !== socket.id)
    console.log(`Socket ${socket.id} disconected`)
  }

  async function eventListeners(){
    // TODO: add event listener
  }

  async function getConnectedPeers(){
    return sockets;
  }

  async function sendEventByName(eventName, eventData){
    let errors = []
    sockets.forEach(socket => {
      socket.emit(eventName, eventData, (err, result) => {
        if (err) errors.push(err)
      });
    })
    errors.length == 0 ? true : false
  }
}
