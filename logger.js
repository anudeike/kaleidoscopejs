//create an eventEmitter
const EventEmitter = require('events')

var url = "http://mylogger.io/log"

class Logger extends EventEmitter{

    //no need for function keyword
    log(msg){
        //send an http request
        console.log(msg)
    
        // raise an event 
        this.emit('msgLogged', { data: msg })
    }

    // log router
    onRoute(route){
        //console.log(route)

        this.emit('routeVisited', { data: route })
    }
}


//export it to other classes as a module
module.exports = Logger;
