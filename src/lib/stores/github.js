import { writable } from 'svelte/store'
import { httpAPI } from '../utils.js'


function createGitHubStore() {
	const P = writable()
	const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "https://api.github.com/repos/OpenEVSE/ESP32_WiFi_V4.x/releases")
		if (res) {
			P.update(() => res)
			return true
		}
		else return false
	}

	return {
		subscribe,
		set,
		update,
		download
	}
}

export const github_store = createGitHubStore()