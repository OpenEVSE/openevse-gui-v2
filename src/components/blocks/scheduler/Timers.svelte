
<script>
	import { _ } 			from 'svelte-i18n'
	import Borders 			from "./../../ui/Borders.svelte";
	import { serialQueue }  from "./../../../lib/queue.js";
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
			if (timeout)
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

</style>
<Box title={$_("scheduler-title")} icon="ion:calendar">
	<div class="my-2 is-flex is-justify-content-center is-align-items-center is-flex-direction-column" >
		<Borders>
			{#if $schedule_store.length}
			<table class="table is-size-6 has-text-weight-normal" >
				<tbody>
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
				</tbody>
			</table>
			{:else}
			<div class="content">{$_("scheduler-empty")}</div>
			{/if}	
		</Borders>
		<div class="mt-4"><Button name={$_("scheduler-newtimer")} butn_submit={addTimer} disabled={$schedule_store.length >= 50}/></div>
	</div>
	
</Box>
{#if timers_modal_opened}
<TimerModal bind:is_opened={timers_modal_opened} timer={timer} />
{/if}