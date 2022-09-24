
<script>

	import TimerModal from "./TimerModal.svelte"
	import TimerTableRow from "../ui/Timer_table_row.svelte"
	import {timers_modal_opened, timers_schedule} from "../../stores.js"

	let t_modal_attr = {t_id: null, t_time: "00:00", t_state: "active",selected_days: [true,true,true,true,true,true,true,true] };

	function addTimer() {
		t_modal_attr = {t_id: 0, t_time: "00:00", t_state: "active",selected_days: [true,true,true,true,true,true,true,true] };
		$timers_modal_opened = true;
	}

	function editTimer(id,time,state,days) {
		t_modal_attr = {t_id: id, t_time: time, t_state: state,selected_days: days };
		$timers_modal_opened = true
	}
</script>

<div class="box">	
	<div class="is-size-4 has-text-weight-bold mb-3">Schedule</div>
	<div class="is-size-6 has-text-weight-bold mb-3">Timers</div>
	<table class="table is-size-6 has-text-weight-normall">
		<tfoot>
			<TimerTableRow t_id={$timers_schedule[0].id} t_time={$timers_schedule[0].time} t_state={$timers_schedule[0].state} t_days={$timers_schedule[0].days} edit={() => {editTimer(1, $timers_schedule[0].time, $timers_schedule[0].state, $timers_schedule[0].days)}} />
			<TimerTableRow t_id={$timers_schedule[1].id} t_time={$timers_schedule[1].time} t_state={$timers_schedule[1].state} t_days={$timers_schedule[1].days} edit={() => {editTimer(1, $timers_schedule[1].time, $timers_schedule[1].state, $timers_schedule[1].days)}} />
		</tfoot>


	</table>
	<button class="button tag is-size-6 is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
	<TimerModal {...t_modal_attr} />
</div>