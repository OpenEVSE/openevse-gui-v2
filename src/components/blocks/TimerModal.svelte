<script>
	export let timers_modal_opened;
	export let timer;
	import {timers_schedule} from "../../lib/stores.js"
	import AlertBox from "../ui/AlertBox.svelte"

	let alert_visible = false;
	let default_timer = 	{
	  id: null,
	  state: "active",
	  time: "00:00",
	  days: [
		"monday",
		"tuesday",
		"wednesday",
		"thirsday",
		"friday",
		"saturday",
		"sunday"
	  ]
	};

	let selected_days = [true,true,true,true,true,true,true,true];
	
	$: if (timers_modal_opened) {
		populate_checkboxes();
		}
	
	function populate_checkboxes() {
		
	        if (timer == null) {
				days2table(default_timer.days)
			}
			else {
				days2table($timers_schedule[timer].days)
				$timers_schedule[timer].time = $timers_schedule[timer].time.slice(0,5)
			}
		}
	$: if (alert_visible == false) {
			populate_checkboxes();
	}

	function days2table(sched) {
		selected_days = [false,false,false,false,false,false,false,true];
		for (let i = 0; i < sched.length; i++) {
			switch (sched[i]) {
				case "monday":
					selected_days[0] = true;
					break;
				case "tuesday":
					selected_days[1] = true;
					break;
				case "wednesday":
					selected_days[2] = true;
					break;
				case "thirsday":
					selected_days[3] = true;
					break;
				case "friday":
					selected_days[4] = true;
					break;
				case "saturday":
					selected_days[5] = true;
					break;
				case "sunday":
					selected_days[6] = true;
					break;
				default:
					break;
			}
		}
		checkDays();
	}

	function table2days() {
		$timers_schedule[timer].days = [];
		if (selected_days[0] == true) $timers_schedule[timer].days.push("monday");
		if (selected_days[1] == true) $timers_schedule[timer].days.push("tuesday");
		if (selected_days[2] == true) $timers_schedule[timer].days.push("wednesday");
		if (selected_days[3] == true) $timers_schedule[timer].days.push("thirsday");
		if (selected_days[4] == true) $timers_schedule[timer].days.push("friday");
		if (selected_days[5] == true) $timers_schedule[timer].days.push("saturday");
		if (selected_days[6] == true) $timers_schedule[timer].days.push("sunday");
	}

	function saveTimer() {
		
		if (selected_days.every(element => element === false)) {
			alert_visible = true;
		}
		else {
			table2days();
			if ($timers_schedule[timer].id) {
				//to do save edited timer
				timers_modal_opened = false;
			
			}
			else {
				//to do save new timer
				timers_modal_opened = false;
			}

		}
		
	}


	function checkDays() {
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


<div id="t_modal" class="modal" class:is-active={timers_modal_opened}>
	<div class="modal-background"></div>
	<div class="modal-content p-3">

		<AlertBox body="You must select at least one day" bind:visible={alert_visible} />

		<div class="box">
			<div class="is-size-4 has-text-weight-bold">
				{#if timer == null}
				New Timer
				{:else}
				Timer {$timers_schedule[timer].id}
				{/if}
			</div>
			<div class="is-size-6">				
				<label class="checkbox">
					<input id="d_mon" type="checkbox" bind:checked={selected_days[0]} on:change={checkDays} >
					Mon
				</label>
				<label class="checkbox">
					<input id="d_tue" type="checkbox" bind:checked={selected_days[1]} on:change={checkDays}>
					Tue
				</label>
				<label class="checkbox">
					<input id="d_wed" type="checkbox" bind:checked={selected_days[2]} on:change={checkDays}>
					Wed
				</label>
				<label class="checkbox">
					<input id="d_thi" type="checkbox" bind:checked={selected_days[3]} on:change={checkDays}>
					Thi
				</label>
				<label class="checkbox">
					<input id="d_fri" type="checkbox" bind:checked={selected_days[4]} on:change={checkDays}>
					Fri
				</label>
				<label class="checkbox">
					<input id="d_sat" type="checkbox"bind:checked={selected_days[5]} on:change={checkDays}>
					Sat
				</label>
				<label class="checkbox">
					<input id="d_sun" type="checkbox" bind:checked={selected_days[6]} on:change={checkDays}>
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
						{#if timer == null}
						<input id="t_start" type="time" bind:value={default_timer.time}>
						{:else}
						<input id="t_start" type="time" bind:value={$timers_schedule[timer].time}>
						{/if}
						
					</label>
				</div>
				<div class="block">
					<div class="select is-info">
						{#if timer == null}
						<select bind:value={default_timer.state}>
							<option value="active" selected>Active</option>
							<option value="disabled">Disabled</option>
						  </select>
						{:else}
						<select bind:value={$timers_schedule[timer].state}>
							<option value="active" selected>Active</option>
							<option value="disabled">Disabled</option>
						  </select>
						{/if}

					  </div>
				</div>
				<button class="button is-danger mt-3" on:click={()=>{saveTimer()}}>Save</button>
				<button class="button is-light mt-3" on:click={()=>{ timers_modal_opened = false}}>Cancel</button>
			</div>
		</div>
	</div>
</div>
