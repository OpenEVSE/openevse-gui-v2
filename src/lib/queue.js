import { PromiseBatcher } from 'promise-batching-queue';

class SerialQueue {
	constructor() {
		this.queue = PromiseBatcher.newSerialQueue();
		this.timeout = null
		this.ispaused = false
	  }
	  
	add = async (fn) => {
		if (!this.ispaused) {
			let res = await this.queue.queue(fn)
			return Promise.resolve(res);
		} else {
			return false
		}

	}

	pause = () => {
		this.ispaused = true
	}

	resume = () => {
		this.ispaused = false 
	}
}


export const serialQueue = new SerialQueue()
export default serialQueue
