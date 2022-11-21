
<script>
	import { serialQueue } from "./../../../lib/queue.js";
	import { onDestroy } 	from "svelte";
	import Box 				from "../../ui/Box.svelte"
	// @ts-ignore
	import TimerModal		from "./TimerModal.svelte"
	import TimerTableRow 	from "../../ui/TimerTableRow.svelte"
	import Button 			from "../../ui/Button.svelte"
	import {schedule_store} from "../../../lib/stores/schedule.js"

	let timers_modal_opened = false
	let timer = null
	let timers = []
	let timersState = []
	let timeouts = []

	onDestroy(() => {
		for ( let timeout in timeouts) {
			clearTimeout(timeout)
		}	
	})

	function editTimer(t) {
		timer = $schedule_store.findIndex(item => item.id === t)
		timers_modal_opened = true
	}

	function addTimer() {
		timer = null;
		timers_modal_opened = true;

	}

	async function removeTimer(t) {
		timer = $schedule_store.findIndex(item => item.id === t)
		timersState[timer] = "loading"
		if (timer > -1) {
			if (await serialQueue.add(() => schedule_store.remove(t))) {
				//success
				timersState[timer] = "" // no need to display ok here as the timer disappear at this time
				$schedule_store.splice(timer,1)
				$schedule_store = $schedule_store
				
			}
			else {
				timersState[timer] = "error"
			}
			timeouts[timer] = setTimeout(()=>{timersState[timer] = null} ,1000)
		}
	}


</script>
<style>
	.timers {
		max-width : 400px;
		/* min-width: 300px;  */
		margin: auto;
	}
</style>
<Box title="Schedule">
	<div class="mb-2">
		<table class="table is-size-6 has-text-weight-normall timers">
			<tbody>
				{#if $schedule_store.length}
					{#each $schedule_store as schedule,id} 
						<TimerTableRow bind:this={timers[id]} 
						t_id={schedule.id}
						t_time={schedule.time}
						t_state={schedule.state}
						t_days={schedule.days}
						edit={() => {editTimer(schedule.id)}}
						remove={() => {removeTimer(schedule.id)}}
						removeState={timersState[id]}
						/>
					{/each}
				{:else}
				<span class="content">Schedule is empty</span>
				{/if}	
			</tbody>
		</table>
	</div>
	<Button name="New" butn_submit={addTimer} tooltip="Add a new timer"/>
</Box>
{#if timers_modal_opened}
<TimerModal bind:is_opened={timers_modal_opened} timer={timer}/>
{/if}