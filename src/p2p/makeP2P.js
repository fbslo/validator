var sockets = []
var isServerListening = false
var blacklist = ['127.0.0.1']

exports.makeP2P = ({ io, ioClient, server }) => {
  return Object.freeze({
    listen,
    getConnectedNodes,
    sendEventByName
  })

  async function listen(){
    const wss = io(server)
    wss.on("connection", (socket) => socketConnected(socket))
    wss.on("error", (error) => console.log(`Error in ws server: ${error}`))
    connectToNodes()
  }

  async function socketConnected(socket){
    if (blacklist.includes(socket.handshake.address.split(":").slice(-1)[0])) {
      disconnectSocket(socket)
      return;
    }
    sockets.push(socket)
    eventListeners(socket)
    console.log(`New socket connected: ${socket.id}`)
  }

  async function disconnectSocket(socket){
    socket.disconnect();
    console.log(`Connection from blacklisted socket ${socket.id} rejected.`)
  }

  async function socketDisconnected(socket){
    sockets = sockets.filter(s => s.id !== socket.id)
    console.log(`Socket ${socket.id} disconected`)
  }

  async function eventListeners(socket){
    // TODO: add event listeners
  }

  async function connectToNodes(){
    let nodes = [{address: '127.0.0.1'}] //get validators from database
    nodes.forEach(node => {
      const socket = ioClient("http://"+node.address, {
        transports: ['websocket']
      });
      socket.on('connect', () => socketConnected(socket));
    })
  }

  async function getConnectedNodes(){
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
