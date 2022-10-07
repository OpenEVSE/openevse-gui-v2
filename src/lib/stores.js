import { writable } from 'svelte/store';

export const timers_schedule = writable([
	{
	  id: 1,
	  state: "active",
	  time: "22:35",
	  days: [
		"monday",
		"tuesday",
		"wednesday",
		"saturday"
	  ]
	},
	{
		id: 2,
		state: "disabled",
		time: "06:25",
		days: [
		  "monday",
		  "tuesday",
		  "wednesday",
		  "saturday"
		]
	  }
  ]);