
<script>

	import TimerModal from "./TimerModal.svelte"
	import TimerTableRow from "../ui/TimerTableRow.svelte"
	import {schedule_store} from "../../lib/stores/schedule.js"

	let timers_modal_opened = false;
	let timer = null;
	let fetchedSched;

	function editTimer(t) {
		timer = $schedule_store.findIndex(item => item.id === t);
		timers_modal_opened = true;
	}

	function addTimer() {
		timer = null;
		timers_modal_opened = true;

	}


</script>
<style>
	.timers {
		/* max-width : 400px;
		min-width: 300px; */
		margin: auto;
	}
</style>
<div class="is-unselectable box">	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
		<div class="timers">
			<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>
				<table class="table is-fullwidth is-size-6 has-text-weight-normall">
					<tbody>
						{#if $schedule_store.length}
							{#each $schedule_store as schedule} 
								<TimerTableRow t_id={schedule.id} edit={() => {editTimer(schedule.id)}}/>
							{/each}
						{:else}
						<span class="content">Schedule is empty</span>
						{/if}	
					</tbody>
				</table>
				<button class="button tag is-size-6 is-info is-outlined mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
			<TimerModal bind:timers_modal_opened={timers_modal_opened} timer={timer}/>
		</div>
</div>