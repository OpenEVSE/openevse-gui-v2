<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faSquarePen, faSquareMinus, faCalendarDays } from '@fortawesome/free-solid-svg-icons/index.js'
	import { link } from "svelte-spa-router";
	import {schedule_store} from "../../lib/stores/schedule.js"
	export let t_id;
	export let edit = (id) => {};
	let timer = $schedule_store.findIndex(item => item.id === t_id);
	let days;

	function deleteTimer(t) {
		timer = $schedule_store.findIndex(item => item.id === t);
		if (timer > -1) {
			$schedule_store.splice(timer,1);
			$schedule_store = $schedule_store;
			schedule_store.remove(t);
		}
		
	}

	function formatDays(days){
    	var d = days.toString().replace(/,/g, " ");  
    	return d
    }

	$: days = $schedule_store[timer].days;
</script>

<tr>
	<th>{$schedule_store[timer].id}</th>
	<th>{$schedule_store[timer].time}</th>
	<th><span class="tag {$schedule_store[timer].state === 'active'?'is-primary':'is-danger'} py-0">{$schedule_store[timer].state}</span></th>
	{#key $schedule_store[timer].days }
	<th class="py-1 px-1">
		<div class="is-size-5  has-tooltip-arrow has-tooltip-info has-tooltip-multiline is-capitalized has-text-weight-normal has-text-centered" data-tooltip={formatDays(days)}><Fa icon={faCalendarDays} /></div>
	</th>
	{/key}
	<th class="is-size-5 py-1 px-1 pr-2">
		<a href="/schedule" use:link on:click={() => {edit($schedule_store[timer].id)}}>
			<Fa icon={faSquarePen} />
		</a>
	</th>
	<th class="is-size-5 py-1 px-0" >
		<a href="/schedule" use:link on:click={() => {deleteTimer($schedule_store[timer].id)}} class="has-text-danger">
			<Fa icon={faSquareMinus} />
		</a>
	</th>
</tr>