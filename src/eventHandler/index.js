const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const p2pEventsHandler = (event, data) => {
  switch (event){
    case "requestHiveToWhiveConversionSiganture":
      break;
    case "requestWhiveToHiveConversionSiganture":
      break;
    case "sharePeerList":
      break;
    case "heartbeat":
      break;
    case "requestPeerSiganture";
      break;
  }
}

module.exports.eventEmitter = eventEmitter
module.exports.p2pEventsHandler = p2pEventsHandler
