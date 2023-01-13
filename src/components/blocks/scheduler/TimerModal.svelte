<script>
	import Borders from "./../../ui/Borders.svelte";
	import { _ } 			from 'svelte-i18n'
	import BoxModal 		from "./../../ui/BoxModal.svelte";
	import { serialQueue }	from "../../../lib/queue.js";
	import {schedule_store} from "../../../lib/stores/schedule.js"
	import AlertBox 		from "../../ui/AlertBox.svelte"
	import Modal 			from "../../ui/Modal.svelte"
	import Button 			from "../../ui/Button.svelte"
	import {onDestroy} 		from "svelte"

	export let is_opened = false;
	export let timer = null;
	let timeout

	let saveTimerState = ""
	let alert_visible = false
	let select
	const default_timer = 	{
	  id: null,
	  state: "active",
	  time: "00:00",
	  days: [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday"
	  ]
	}

	let selected_days = [true,true,true,true,true,true,true,true];
	
	$: if (is_opened) {
		populate_checkboxes();
		}
	
	onDestroy(() => {
		if (timeout)
			clearTimeout(timeout)
	})

	function populate_checkboxes() {
		
	        if (timer == null) {
				days2table(default_timer.days)
			}
			else {
				days2table($schedule_store[timer].days)
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
				case "thursday":
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

	function table2days(sched) {
		sched.days = [];
		if (selected_days[0] == true) sched.days.push("monday");
		if (selected_days[1] == true) sched.days.push("tuesday");
		if (selected_days[2] == true) sched.days.push("wednesday");
		if (selected_days[3] == true) sched.days.push("thursday");
		if (selected_days[4] == true) sched.days.push("friday");
		if (selected_days[5] == true) sched.days.push("saturday");
		if (selected_days[6] == true) sched.days.push("sunday");
		$schedule_store = $schedule_store; 
	}

	async function saveTimer() {
		if (selected_days.every(element => element === false)) {
			alert_visible = true;
		}
		else {
			saveTimerState = "loading"
			let schedule;
			if (timer == null) schedule = {...default_timer};
			else 			   schedule = $schedule_store[timer];
			table2days(schedule);

			if (timer == null) {
				if ($schedule_store.length) {
					schedule.id = $schedule_store[$schedule_store.length-1].id + 1;
				}
				else schedule.id = 1;
			}
			let res = await serialQueue.add(() => schedule_store.upload(schedule))
			if (res) 
				{
					saveTimerState = "ok"
					if (timer == null) {
						$schedule_store.push(schedule)
					}
					timeout = setTimeout(() => {
						is_opened = false
					}, 500);

				}
			else {
				saveTimerState = "error"
			}
			$schedule_store = $schedule_store; // force redraw
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
<style>
	.checkbox {
		accent-color: #38a4b6;
	}
</style>

<Modal bind:is_opened>

	<AlertBox body="You must select at least one day" bind:visible={alert_visible} />
	<BoxModal title={timer == null?$_("scheduler-newtimer"): $_("scheduler-timer")+" #" + $schedule_store[timer].id} >
		<div class="mt-2 is-size-6 is-flex is-justify-content-center">	
			<Borders>			
				<label class="checkbox">
					<input id="d_mon" type="checkbox" bind:checked={selected_days[0]} on:change={checkDays} >
					<span class="is-capitalized">{$_("days.monday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_tue" type="checkbox" bind:checked={selected_days[1]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.tuesday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_wed" type="checkbox" bind:checked={selected_days[2]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.wednesday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_thu" type="checkbox" bind:checked={selected_days[3]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.thursday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_fri" type="checkbox" bind:checked={selected_days[4]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.friday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_sat" type="checkbox"bind:checked={selected_days[5]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.saturday").substr(0,3)}</span>
				</label>
				<label class="checkbox">
					<input id="d_sun" type="checkbox" bind:checked={selected_days[6]} on:change={checkDays}>
					<span class="is-capitalized">{$_("days.sunday").substr(0,3)}</span>
				</label>
				<div>
					<label class="checkbox has-text-weight-semibold">
						<input id="d_all" type="checkbox" bind:checked={selected_days[7]} on:change={() => {checkAll(selected_days[7])}}>
						{#if !selected_days[7]}
						{$_("scheduler-checkall")}
						{:else}
						{$_("scheduler-uncheckall")}
						{/if}
					</label>
				</div>	
			</Borders>
		</div>

		
		<div class="pt-5">
			<div class="is-flex is-justify-content-space-around">
				<div class="is-inline-block">
					<label class="has-text-weight-semibold">
						<div>{$_("scheduler-time")}</div>
						{#if timer == null}
						<input class="input is-info" id="t_start" type="time" bind:value={default_timer.time}>
						{:else}
						<input class="input is-info" id="t_start" type="time" bind:value={$schedule_store[timer].time}>
						{/if}
					</label>
				</div>
				<div class="is-inline-block">
					<div class="has-text-weight-semibold">{$_("scheduler-state")}</div>
					
						{#if timer == null}
						<div class="select {default_timer.state=="active"?"is-primary":"is-danger"}" >
							<select bind:this={select} bind:value={default_timer.state}>
								<option value="active" selected>{$_("active")}</option>
								<option value="disabled">{$_("disabled")}</option>
							</select>
							</div>
						{:else}
						<div class="select {$schedule_store[timer].state=="active"?"is-primary":"is-danger"}" >
							<select bind:value={$schedule_store[timer].state}>
								<option value="active">{$_("active")}</option>
								<option value="disabled">{$_("disabled")}</option>
							</select>
						</div>
						{/if}
				</div>
		</div>
		<div class="mt-4 is-flex is-justify-content-center mb-4">
			<Button name={$_("save")} color="is-info" butn_submit={saveTimer} state={saveTimerState}/>
			<Button name={$_("close")} color="is-danger" butn_submit={()=>is_opened = false} />
		</div>
	</BoxModal>
</Modal>