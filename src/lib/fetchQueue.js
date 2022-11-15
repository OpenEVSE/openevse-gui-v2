import Queue from "./libQueue.js"
class FetchQueue {
	constructor() {
	  this.queue = new Queue(true)
	  this.timeout = null
	  this.ispaused = false
	}
  
	add(fn) {
		// Ignore incoming requests while paused ( mostly for firmware upgrade )
		if (!this.pause) {
			let res = this.queue.add(fn)
			return res
		}
		
	}
	next() {	
		if (!this.pause) {	
			let res = this.queue.next
			return res
		}
	}

	pause() {
		this.ispaused = true
		this.queue.autorun = false
	}

	start() {
		this.ispaused = false
		this.queue.autorun = true
		this.next()
	}


  }
  
  export const fetchQueue = new FetchQueue();