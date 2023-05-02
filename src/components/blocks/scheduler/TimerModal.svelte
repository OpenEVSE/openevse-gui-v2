<script>
	import Box 				     from "./../../ui/Box.svelte";
	import Checkbox 			 from "./../../ui/Checkbox.svelte";
	import Borders 				 from "./../../ui/Borders.svelte";
	import { _ } 				 from 'svelte-i18n'
	import { serialQueue }		 from "../../../lib/queue.js";
	import {schedule_store} 	 from "../../../lib/stores/schedule.js"
	import AlertBox 			 from "../../ui/AlertBox.svelte"
	import Modal 			 	 from "../../ui/Modal.svelte"
	import Button 			     from "../../ui/Button.svelte"
	import {onDestroy, onMount}  from "svelte"

	export let is_opened = false;
	export let timer = null;

	let schedules = []
	let timeout
	let days = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday"
	]

	let saveTimerState = ""
	let alert_visible = false
	let select
	const default_timer = 	{
	  id: null,
	  state: "active",
	  time: "00:00",
	  days: days
	}

	let selected_days = [true,true,true,true,true,true,true,true];
	
	$: if (is_opened) {
		schedules = Object.assign({}, $schedule_store);
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
				days2table(schedules[timer].days)
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
		for (let i = 0; i < selected_days.length; i++) {
			if (selected_days[i] == true) sched.days.push(days[i]);
		}
		sched = sched
	}

	async function saveTimer() {
		if (selected_days.every(element => element === false)) {
			alert_visible = true;
		}
		else {
			saveTimerState = "loading"
			let schedule;
			if (timer == null) schedule = {...default_timer};
			else 			   schedule = schedules[timer];
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
	.days {
		max-width: 400px;
	}
</style>

<Modal fit bind:is_opened>

	<AlertBox title={$_("error")}  body="You must select at least one day" bind:visible={alert_visible} />
	<Box title={timer == null?$_("scheduler-newtimer"): $_("scheduler-timer")+" #" + schedules[timer].id} >
		<div class="mt-2 is-size-6">	
			<Borders grow>
				<div class="is-flex is-justify-content-center">
					<div class="days is-flex-shrink-0 is-flex-grow-1 is-flex is-justify-content-space-evenly">
						{#each days as day,i }
						<div class="mx-1 is-inline-block">
							<Checkbox 
							color="dark" bold
							label={$_("days." + day).substr(0,3)}  
							bind:checked={selected_days[i]}  
							onChange={checkDays}
							tooltip={$_("days" + day)}	
						/>
						</div>
						{/each}
					</div>
				</div>
				<Checkbox 
					color="dark" bold
					label={selected_days[7]?$_("scheduler-uncheckall"):$_("scheduler-checkall")}
					bind:checked={selected_days[7]}
					onChange={() => {checkAll(selected_days[7])}}
					tooltip={null}
				/>
			</Borders>
		</div>

		
		<div class="pt-5">
			<div class="is-flex is-justify-content-space-around">
				<div class="is-inline-block">
					<label class="has-text-weight-semibold">
						<div class="has-text-dark has-text-centered">{$_("scheduler-time")}</div>
						{#if timer == null}
						<input class="input is-info" id="t_start" type="time" bind:value={default_timer.time}>
						{:else}
						<input class="input is-info" id="t_start" type="time" bind:value={schedules[timer].time}>
						{/if}
					</label>
				</div>
				<div class="is-inline-block">
					<div class="has-text-dark has-text-centered has-text-weight-semibold">{$_("scheduler-state")}</div>
					
						{#if timer == null}
						<div class="select {default_timer.state=="active"?"is-primary":"is-danger"}" >
							<select bind:this={select} bind:value={default_timer.state}>
								<option value="active" selected>{$_("active")}</option>
								<option value="disabled">{$_("disabled")}</option>
							</select>
							</div>
						{:else}
						<div class="select {schedules[timer].state=="active"?"is-primary":"is-dark"}" >
							<select bind:value={schedules[timer].state}>
								<option value="active">{$_("active")}</option>
								<option value="disabled">{$_("disabled")}</option>
							</select>
						</div>
						{/if}
				</div>
		</div>
		<div class="mt-4 is-flex is-justify-content-center mb-4">
			<Button name={$_("save")} color="is-info" butn_submit={saveTimer} state={saveTimerState}/>
			<Button name={$_("cancel")} color="is-danger" butn_submit={()=>is_opened = false} />
		</div>
	</Box>
</Modal>