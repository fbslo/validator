var sockets = []
var isServerListening = false

exports.makeP2P = ({ io, ioClient, server }) => {
  return Object.freeze({
    listen,
    getConnectedNodes,
    sendEventByName
  })

  async function startServer(){
    return new Promise((resolve, reject)  => {
      if (!isServerListening){
        server.listen(process.env.PORT, () => {
          console.log(`Server started at port: ${process.env.PORT}`)
          isServerListening = true
          resolve(server)
        });
      } else {
        resolve(server)
      }
    })
  }

  async function listen(){
    const createServer = await startServer()
    const wss = io(createServer)
    wss.on("connection", (socket) => socketConnected(socket))
    wss.on("error", (error) => console.log(`Error in ws server: ${error}`))
    connectToNodes()
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
