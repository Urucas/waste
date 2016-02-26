var logger = require('semafor')()
var HID = require('node-hid')

var event = function(buffer) {
  var events = []
  // check button events
  if((buffer[0] & 1) === 1) 
    events.push({event:"left button"}) 
  else if((buffer[0] & 2) === 2) 
    events.push({event:"right button"})
  else if((buffer[0] & 4) === 4) 
    events.push({event:"middle button"})
  // check mouse move events
  if(Math.abs(0 - buffer[1]) > Math.abs(buffer[1] - 255)) 
    events.push({event:"moving left"})
  else
    events.push({event:"moving right"})
  if(Math.abs(0 - buffer[2]) < Math.abs(buffer[2] - 255)) 
    events.push({event:"moving down"})
  else
    events.push({event:"moving up"})
  return events
}

var devices = HID.devices(), path
devices.map(function(device){
  if(device["manufacturer"] == "Genius" &&
    device["product"] == "USB Optical Mouse") {
    path = device["path"]
  }    
})
if(!path) return logger.fail("Mouse not connected")

var device = new HID.HID(path)
if(!device) return logger.fail("Error connecting to device", device)

logger.ok("Waiting for mouse events")
device.on("data", function(buffer){
  console.log(event(buffer))  
})
device.on("error", function(err){
  logger.fail(err)
})
