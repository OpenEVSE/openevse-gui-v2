import Queue from "./libQueue.js"
class FetchQueue {
	constructor() {
	  this.queue = new Queue(true)
	  this.timeout = null
	}
  
	add(fn) {
		this.queue.add(fn)
	}
	next() {		
		this.queue.next
	}
  }
  
  export const fetchQueue = new FetchQueue();