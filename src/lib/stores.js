import { writable, derived } from 'svelte/store';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const timers_schedule = writable([]);

/** Data transformation.
For our use case, we only care about the drink names, not the other information.
Here, we'll create a derived store to hold the drink names.
**/
export async function fetchSchedule() {
	fetch("/schedule")
	.then(response => response.json())
	.then(data => {
		console.log(data);
		timers_schedule.set(data);
	}).catch(error => {
		console.log(error);
		return [];
	});
};