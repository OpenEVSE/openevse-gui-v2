<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faSquarePen, faSquareMinus, faCalendarDays } from '@fortawesome/free-solid-svg-icons/index.js'
	import { link } from "svelte-spa-router";
	import {timers_schedule, deleteSchedule} from "../../lib/stores.js"
	export let t_id;
	export let edit = (id) => {};
	let timer = $timers_schedule.findIndex(item => item.id === t_id);
	let days;

	function deleteTimer(t) {
		timer = $timers_schedule.findIndex(item => item.id === t);
		if (timer > -1) {
			$timers_schedule.splice(timer,1);
			$timers_schedule = $timers_schedule;
		}
		deleteSchedule(t);
	}

	$: days = $timers_schedule[timer].days;



</script>
<tr>
	<th>{$timers_schedule[timer].id}</th>
	<th>{$timers_schedule[timer].time}</th>
	<th><span class="tag {$timers_schedule[timer].state === 'active'?'is-primary':'is-danger'} py-0">{$timers_schedule[timer].state}</span></th>
	{#key $timers_schedule[timer].days }
	<th class="is-size-5 py-1 px-1 has-tooltip-arrow has-tooltip" data-tooltip={days}>
		<Fa icon={faCalendarDays} />
	</th>
	{/key}
	<th class="is-size-5 py-1 px-1 pr-2">
		<a href="/schedule" use:link on:click={() => {edit($timers_schedule[timer].id)}}>
			<Fa icon={faSquarePen} />
		</a>
	</th>
	<th class="is-size-5 py-1 px-0" >
		<a href="/schedule" use:link on:click={() => {deleteTimer($timers_schedule[timer].id)}} class="has-text-danger">
			<Fa icon={faSquareMinus} />
		</a>
	</th>
</tr>