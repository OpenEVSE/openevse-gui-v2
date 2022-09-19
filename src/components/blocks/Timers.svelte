
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
			<TimerTableRow t_id=1 t_time="22:30" t_state="active" t_days={t_modal_attr} edit={() => {editTimer(1, "22:30", "active", [true,true,true,true,true,true,true,true])}} />
		</tfoot>


	</table>
	<button class="button tag is-info mt-3 has-tooltip-arrow has-tooltip" data-tooltip="Add a new timer"  on:click={()=>{ addTimer()}}>New</button>
	<TimerModal {...t_modal_attr} />
</div>