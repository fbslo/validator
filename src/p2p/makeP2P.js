var sockets = []
var isServerListening = false
var blacklist = []
var acceptDuplicates = process.env.ENVIRONMENT == 'test' ? true : false

exports.makeP2P = ({ io, ioClient, server, validatorDatabase, p2pEventsHandler }) => {
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
    let socketIP = socket.handshake.address.split(":").slice(-1)[0]
    let connectedIPs = sockets.map(socket => { return socket.handshake.address.split(":").slice(-1)[0] })
    if (blacklist.includes(socketIP) || connectedIPs.includes(socketIP) && !acceptDuplicates) {
      rejectBlacklisted(socket)
      return;
    }
    sockets.push(socket)
    eventListeners(socket)
    console.log(`New socket connected: ${socket.id}`)
  }

  async function rejectBlacklisted(socket){
    socket.disconnect();
    console.log(`Connection from blacklisted/duplicated socket ${socket.id} rejected.`)
  }

  async function socketDisconnected(socket){
    sockets = sockets.filter(s => s.id !== socket.id)
    console.log(`Socket ${socket.id} disconected`)
  }

  async function eventListeners(socket){
    let onevent = socket.onevent; //create wildcard to catch all custom events
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call(this, packet); // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet); // additional call to catch-all
    };
    socket.on("*", (event, data) => {
      if (event == 'disconnect') socketDisconnected(socket);
      else p2pEventsHandler(event, data)
    })
  }

  async function connectToNodes(){
    let nodes = await validatorDatabase.findAllAddresses()
    nodes.forEach(node => {
      const socket = ioClient("http://"+node, {
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
