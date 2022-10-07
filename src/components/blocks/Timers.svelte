
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
		timer = t;
		timers_modal_opened = true;
	}
</script>

<div>	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
	<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>
	<table class="table is-size-6 has-text-weight-normall">
		<tfoot>
			<TimerTableRow t_id={$timers_schedule[0].id} t_time={$timers_schedule[0].time} t_state={$timers_schedule[0].state} t_days={$timers_schedule[0].days} edit={() => {editTimer(0)}} />
			<TimerTableRow t_id={$timers_schedule[1].id} t_time={$timers_schedule[1].time} t_state={$timers_schedule[1].state} t_days={$timers_schedule[1].days} edit={() => {editTimer(1)}} />
		</tfoot>


	</table>
	<button class="button tag is-size-6 is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
	<TimerModal bind:timers_modal_opened={timers_modal_opened} timer={timer}/>
</div>