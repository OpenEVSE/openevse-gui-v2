<script>
	import {timers_modal_opened} from "../../stores.js"
	export let t_id = 0;
	export let t_time;
	export let t_state;
	export let selected_days;

function saveTimer() {
	if (t_id) {
		//save edited timer
		console.log("save edited timer");
		$timers_modal_opened = false;
	}
	else {
		// save new timer
		console.log("save new timer");
		$timers_modal_opened = false;
	}
}


function checkDay() {
	for (let i = 0; i < 7; i++) {		
		if (selected_days[i] == false) {
			selected_days[7] = false;
		}
	}
}
function checkAll(checked) {
	if (checked) {
		selected_days = [true,true,true,true,true,true,true,true];
	}
	else selected_days = [false,false,false,false,false,false,false,false];
}


</script>	


<div id="t_modal" class="modal" class:is-active={$timers_modal_opened}>
	<div class="modal-background"></div>
	<div class="modal-content p-3">
		<div class="box">
			<div class="is-size-4 has-text-weight-bold">
				{#if t_id==0}
				New Timer
				{:else}
				Timer {t_id}
				{/if}
			</div>
			<div class="is-size-6">				
				<label class="checkbox">
					<input id="d_mon" type="checkbox" bind:checked={selected_days[0]} on:change={checkDay} >
					Mon
				</label>
				<label class="checkbox">
					<input id="d_tue" type="checkbox" bind:checked={selected_days[1]} on:change={checkDay}>
					Tue
				</label>
				<label class="checkbox">
					<input id="d_wed" type="checkbox" bind:checked={selected_days[2]} on:change={checkDay}>
					Wed
				</label>
				<label class="checkbox">
					<input id="d_thi" type="checkbox" bind:checked={selected_days[3]} on:change={checkDay}>
					Thi
				</label>
				<label class="checkbox">
					<input id="d_fri" type="checkbox" bind:checked={selected_days[4]} on:change={checkDay}>
					Fri
				</label>
				<label class="checkbox">
					<input id="d_sat" type="checkbox"bind:checked={selected_days[5]} on:change={checkDay}>
					Sat
				</label>
				<label class="checkbox">
					<input id="d_sun" type="checkbox" bind:checked={selected_days[6]} on:change={checkDay}>
					Sun
				</label>
				<label class="checkbox has-text-weight-semibold">
					<input id="d_all" type="checkbox" bind:checked={selected_days[7]} on:change={() => {checkAll(selected_days[7])}}>
					{#if !selected_days[7]}
					Check All
					{:else}
					Uncheck All
					{/if}
				</label>
			</div>
			<div class="container pt-5">
				<div class="block">
					<label class="checkbox has-text-weight-semibold">
						Time: &nbsp;
						<input id="t_start" type="time" bind:value={t_time}>
					</label>
				</div>
				<div class="block">
					<div class="select is-info">
						<select bind:value={t_state}>
						  <option value="active" selected>Active</option>
						  <option value="disabled">Disabled</option>
						</select>
					  </div>
				</div>
				<button class="button is-danger mt-3" on:click={()=>{saveTimer()}}>Save</button>
				<button class="button is-light mt-3" on:click={()=>{ $timers_modal_opened = false}}>Cancel</button>
			</div>
		</div>
	</div>
</div>
