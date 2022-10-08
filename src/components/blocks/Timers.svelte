
<script>

	import TimerModal from "./TimerModal.svelte"
	import TimerTableRow from "../ui/Timer_table_row.svelte"
	import {timers_schedule} from "../../lib/stores.js"
	let timers_modal_opened = false;
	let timer = null;
	


	function addTimer() {
		timer = null;
		timers_modal_opened = true;

	}

	function editTimer(t) {
		timer = $timers_schedule.findIndex(item => item.id === t);
		timers_modal_opened = true;
	}
</script>

<div>	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
	<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>
	<table class="table is-size-6 has-text-weight-normall">
		<tfoot>
			{#each $timers_schedule as schedule} 
			<TimerTableRow t_id={schedule.id} t_time={schedule.time} t_state={schedule.state} t_days={schedule.days} edit={() => {editTimer(schedule.id)}} />
			{/each}
		</tfoot>


	</table>
	<button class="button tag is-size-6 is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
	<TimerModal bind:timers_modal_opened={timers_modal_opened} timer={timer}/>
</div>