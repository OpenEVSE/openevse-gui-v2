
<script>

	import TimerModal from "./TimerModal.svelte"
	import TimerTableRow from "../ui/Timer_table_row.svelte"
	import { onMount } from "svelte";
	import {timers_schedule, fetchSchedule} from "../../lib/stores.js"

	let timers_modal_opened = false;
	let timer = null;
	
	function editTimer(t) {
		timer = $timers_schedule.findIndex(item => item.id === t);
		timers_modal_opened = true;
	}

	function addTimer() {
		timer = null;
		timers_modal_opened = true;

	}

	fetchSchedule();

</script>

<div>	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
	<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>
	<table class="table is-size-6 has-text-weight-normall">
		<tfoot>
			
			{#each $timers_schedule as schedule} 
				<TimerTableRow t_id={schedule.id} edit={() => {editTimer(schedule.id)}}/>
			{/each}
			
		</tfoot>


	</table>
	<button class="button tag is-size-6 is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
	<TimerModal bind:timers_modal_opened={timers_modal_opened} timer={timer}/>
</div>