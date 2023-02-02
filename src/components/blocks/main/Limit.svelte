<script>
	import LimitTag from "./../../ui/LimitTag.svelte";
	import { status_store } from "./../../../lib/stores/status.js";
	import { serialQueue } 	from "./../../../lib/queue.js";
	import { onMount } 		from "svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import { limit_store } 	from "./../../../lib/stores/limit.js";
	import {round} 			from "../../../lib/utils.js"
	import Checkbox 		from "./../../ui/Checkbox.svelte";
	import Box 				from "./../../ui/Box.svelte";
	import Button 			from "./../../ui/Button.svelte";
	import SliderForm 		from "./../../ui/SliderForm.svelte";
	import Modal 			from "./../../ui/Modal.svelte";
	import Select 			from "./../../ui/Select.svelte";
	import Borders 			from "./../../ui/Borders.svelte";


	let LimitTypes = {
		none: 	{name: "None",   unit: "", 	  icon: ""},
		time:   {name: "Time",   unit: "", 	  icon: "fa6-solid:hourglass-half"},
		energy: {name: "Energy", unit: "kWh", icon: "fa6-solid:bolt"},
		soc:    {name: "Battery",unit: "%",   icon: "material-symbols:battery-5-bar-sharp", disabled: true},
		range:  {name: "Range",  unit: "km",  icon: "material-symbols:width", disabled: true}
	}

	const hoursItems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
	const minItems = [0,5,10,15,20,25,30,25,40,45,50,55]

	let typeItems = []
	

	let limit = {
		type: "none",
		value: undefined,
		auto_release: true
	}

	let modal = false
	let butn_set_state = ""
	let butn_del_state = ""

	let time_h = 0
	let time_m = 0
	let time_pickr_box = false
	let time_pickr_display = ""

	let getLimit = async () => {
		let res = await serialQueue.add(()=>limit_store.download())
		if (!res) {
			console.log("Error getting limit")
		}
	}

	let setLimit = async () => {
		if (limit.type != "none") {
			butn_set_state = "loading"
			let res = await serialQueue.add(()=>limit_store.upload(limit))
			if (res) {
				butn_set_state = "ok"
				$limit_store = limit
			}
			else
				butn_set_state = "error"
		}
		else {
			removeLimit()
		}
		modal = false
			
	}

	let removeLimit = async () => {
		butn_del_state = "loading"
		let res = await serialQueue.add(()=>limit_store.remove())
		if (res)
				butn_del_state = "ok"
			else
				butn_del_state = "error"
		setTimeout(() => {
			butn_del_state = ""
		}, 1000);
	}

	let selectType = () => {
		limit.value = 0
	}

	let setTimeInput = () => {
		limit.value = (time_h * 60) + time_m
    }

	let setEnergyInput = (val) => {
		limit.value = val * 1000
	}

	onMount( () => {
		LimitTypes.range.unit = $config_store.mqtt_vehicle_range_miles?"miles":"km"
		if ($status_store.limit)
			getLimit()
		else {
			limit.type="none"
			limit.value=0
			limit.auto_release = true
		}
		if ($status_store.battery_level != undefined) {
			LimitTypes.soc.disabled = false
		}
		if ($status_store.battery_range != undefined) {
			LimitTypes.range.disabled = false
		}
		Object.keys(LimitTypes).forEach((key,i) => {
			typeItems[i] = {name: LimitTypes[key].name, value: key }
			if (LimitTypes[key].disabled != undefined) {
				typeItems[i].disabled = LimitTypes[key].disabled
			}
		})
	})
	
</script>
<style>
	.content {
		width: 280px;
		height: fit-content;
	}
	.modal-content {
		max-width: 420px;
		overflow: hidden;
	}
	.slider {
		width:100%;
	}

</style>

<Borders grow>
	<div class="content">
		<div class="is-flex is-justify-content-center is-flex-direction-column" >
			<div class="is-size-6 has-text-info has-text-weight-bold mb-2">
				CHARGE LIMIT
			</div>
			{#if $limit_store.type != "none"}
			<div class="mb-2">
				<LimitTag 
					type={$limit_store.type} 
					types={LimitTypes}
					value={$limit_store.value} 
					unit={LimitTypes[$limit_store.type].unit}
					icon={LimitTypes[$limit_store.type].icon}
					onClick={removeLimit}
					state={butn_del_state}
					/>
			</div>
			{:else}
			<div class="has-text-info">
				<Button name="New" butn_submit={()=> modal = true}/>	
			</div>
			{/if}
		</div>
	</div>
</Borders>

<Modal canClose={true} bind:is_opened={modal} fit>
	<div class="modal-content">
		<Box title="Charge Limit">
			<div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center mb-4">
				<Select bind:value={limit.type} items={typeItems} onChange={selectType} />
				{#if limit.type=="time"}
				<div class="is-inline-block">
					<Select title="Hours" bind:value={time_h}  items={hoursItems} onChange={setTimeInput} />
					<Select title="Minutes" bind:value={time_m}  items={minItems} onChange={setTimeInput} />
				</div>
				{:else if limit.type=="energy"}
				<div class="mx-2 slider">
					<SliderForm value={round(limit.value/1000,1)} min=0 max=100 unit={LimitTypes[limit.type].unit} step={1} onchange={setEnergyInput} />
				</div>
				{:else if limit.type=="soc"}
				<div class="mx-2 slider">
					<SliderForm bind:value={limit.value} min=0 max=100 unit={LimitTypes[limit.type].unit} step={1} />
				</div>
				{:else if limit.type=="range"}
				<div class="mx-2 slider">
					<SliderForm bind:value={limit.value} min=0 max=600 unit={LimitTypes[limit.type].unit} step={1} />
				</div>
				{/if}
				{#if limit.type!="none"}
				<div class="mt-2 is-size-7">
					<Checkbox bind:checked={limit.auto_release} label="This session only"/>
				</div>
				{/if}
				<div class="mt-2">
					<Button name="Set limit" bind:state={butn_set_state} butn_submit={setLimit} disabled={!limit.value} />
				</div>
			</div>
		</Box>
	</div>
</Modal>