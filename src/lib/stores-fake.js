import { writable } from 'svelte/store';

export const timers_schedule = writable([
	{
	  id: 1,
	  state: "active",
	  time: "20:35",
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
		time: "09:25",
		days: [
		  "monday",
		  "tuesday",
		  "wednesday",
		  "sunday"
		]
	  }
  ]);