<script>
	import { fetchQueue } from "./../../../lib/fetchQueue.js";
	import Box from "./../../ui/Box.svelte";
	import {schedule_store} from "../../../lib/stores/schedule.js"
	import AlertBox from "../../ui/AlertBox.svelte"
	import Modal from "../../ui/Modal.svelte"
	import Button from "../../ui/Button.svelte"
	import {onDestroy} from "svelte"

	export let is_opened;
	export let timer = null;
	let timeout

	let saveTimerState = "default"
	let alert_visible = false
	let select
	let title
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

	$: (timer) => {
		if (timer == null) 
			title = "New Timer"
		else 
			title = "Timer " + $schedule_store[timer].id
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
			let res = await fetchQueue.add(schedule_store.upload(schedule))
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


<Modal bind:is_opened>

	<AlertBox body="You must select at least one day" bind:visible={alert_visible} />
		{#if timer == null}
			{title = "New Timer"}
		{:else}
			{title = "Timer " + $schedule_store[timer].id}
		{/if}
	
	<Box title={title}>
		<div class="mt-2 is-size-6">				
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
				<input id="d_thu" type="checkbox" bind:checked={selected_days[3]} on:change={checkDays}>
				Thu
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
		<div class="pt-5">
			<div class="is-flex is-justify-content-space-around">
				<div class="is-inline-block">
					<label class="has-text-weight-semibold">
						<div>Time</div>
						{#if timer == null}
						<input class="input is-info" id="t_start" type="time" bind:value={default_timer.time}>
						{:else}
						<input class="input is-info" id="t_start" type="time" bind:value={$schedule_store[timer].time}>
						{/if}
					</label>
				</div>
				<div class="is-inline-block">
					<div class="has-text-weight-semibold">State</div>
					
						{#if timer == null}
						<div class="select {default_timer.state=="active"?"is-primary":"is-danger"}" >
							<select bind:this={select} bind:value={default_timer.state}>
								<option value="active" selected><span class="">Active</span></option>
								<option value="disabled">Disabled</option>
							</select>
							</div>
						{:else}
						<div class="select {$schedule_store[timer].state=="active"?"is-primary":"is-danger"}" >
							<select bind:value={$schedule_store[timer].state}>
								<option value="active" selected>Active</option>
								<option value="disabled">Disabled</option>
							</select>
						</div>
						{/if}
				</div>
		</div>
		<div class="mt-4">
			<Button name="Save" color="is-info" butn_submit={saveTimer} state={saveTimerState}/>
			<Button name="Close" color="is-danger" butn_submit={()=>is_opened = false} />
		</div>
	</Box>
</Modal>