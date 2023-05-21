<script>
	import { _ } 		    from 'svelte-i18n'
	import { derived }		from "svelte/store"
	import LimitTag from "./../../ui/LimitTag.svelte";
	import { status_store } from "./../../../lib/stores/status.js";
	import { serialQueue } 	from "./../../../lib/queue.js";
	import { onMount } 		from "svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import { limit_store } 	from "./../../../lib/stores/limit.js";
	import {round, sec2time} 			from "../../../lib/utils.js"
	import Box 				from "./../../ui/Box.svelte";
	import Button 			from "./../../ui/Button.svelte";
	import SliderForm 		from "./../../ui/SliderForm.svelte";
	import Modal 			from "./../../ui/Modal.svelte";
	import Select 			from "./../../ui/Select.svelte";
	import Borders 			from "./../../ui/Borders.svelte";

	export let is_admin = false

	let mounted = false

	let LimitTypes = {
		none:   {name: $_("limits.type.none"),   unit: "", 	  icon: ""},
		time:   {name: $_("limits.type.time"),   unit: "", 	  icon: "fa6-solid:hourglass-half"},
		energy: {name: $_("limits.type.energy"), unit: "kWh", icon: "fa6-solid:bolt"},
		soc:    {name: $_("limits.type.soc"), unit: "%",   icon: "material-symbols:battery-5-bar-sharp", disabled: true},
		range:  {name: $_("limits.type.range"),  unit: "km",  icon: "oi:resize-width", disabled: true}
	}

	const hoursItems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
	const minItems = [0,5,10,15,20,25,30,35,40,45,50,55]

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

	let getCountd = (store) => {
		let ctval
		if ($limit_store) {
			switch ($limit_store.type) {
				case "time":
					if ($limit_store.value*60 >= store.session_elapsed)
						ctval = sec2time($limit_store.value*60 - store.elapsed)
					else ctval = "00:00:00"
					break
				case "energy": 
					ctval = round(($limit_store.value - store.session_energy)/1000,2)
					ctval = ctval<0?0.0:ctval.toFixed(2)
					break;
				case "soc":
					ctval = $limit_store.value - store.battery_level
					ctval = ctval<0?0:ctval
					break
				case "range":
					ctval = $limit_store.value - store.battery_range
					ctval = ctval<0?0:ctval
					break;
				default:
					ctval = 0
					break;
			}
		}
		else ctval = 0
		return ctval
	}

	let countd = derived(status_store, store => {
		return getCountd(store)
	})

	let getLimit = async () => {
		let res = await serialQueue.add(()=>limit_store.download())
		if (!res) {
			console.log("Error getting limit")
		}
	}

	let setLimit = async () => {
		if (limit.type != "none") {
			butn_set_state = "loading"
			let res
			if (!is_admin)
				res = await serialQueue.add(()=>limit_store.upload(limit))
			else {

				const limit_conf = {
					limit_default_type: limit.type,
					limit_default_value: limit.value
				}
				res = await serialQueue.add(()=>config_store.upload(limit_conf))
			}
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
		let res
		if (!is_admin)
			res = await serialQueue.add(()=>limit_store.remove())
		else
			res = await serialQueue.add(()=>config_store.upload({limit_default_type: "none"}))
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
		time_h = 0
		time_m = 0
		if (is_admin) {
			limit.auto_release = false
		}
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
			delete LimitTypes.soc.disabled
		}
		if ($status_store.battery_range != undefined) {
			delete LimitTypes.range.disabled
		}
		Object.keys(LimitTypes).forEach((key,i) => {
			typeItems[i] = {name: LimitTypes[key].name, value: key }
			if (LimitTypes[key].disabled != undefined) {
				typeItems[i].disabled = LimitTypes[key].disabled
			}
		})
		mounted = true
	})

	$: $limit_store.val, $status_store = $status_store

	
</script>
<style>
	.content {
		width: 260px;
		height: 100px;
		/* height: fit-content; */
	}
	.content_admin {
		height:88px;
		/* height: fit-content; */
	}
	.modal-content {
		max-width: 500px;
		min-width: 290px;
		overflow: auto;;
		max-height: 95%;
	}
	.slider {
		width:100%;
	}

</style>

{#if mounted}
<Borders grow has_help={is_admin?true:false}>
	<div slot="help">
		{@html $_("config.evse.limit-help")}
	</div>
	<div class:content={!is_admin} class:content_admin={is_admin}>
		<div class="is-flex is-justify-content-center is-flex-direction-column" >
			<div class="is-size-6 has-text-dark has-text-weight-bold mb-4">
				{is_admin?$_("limits.system-limit"):$_("limits.limit")}
			</div>
			{#if $limit_store.type != "none" && (!is_admin || (is_admin && !$limit_store.auto_release))}
			<!-- if is_admin only display auto_release=false limit -->
			<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
				<LimitTag 
					type={$limit_store.type} 
					types={LimitTypes}
					{is_admin}
					value={$limit_store.value}
					left={$countd}
					unit={LimitTypes[$limit_store.type].unit}
					icon={LimitTypes[$limit_store.type].icon}
					onClick={removeLimit}
					state={butn_del_state}
					auto_release={$limit_store.auto_release}
				/>

			</div>
			{:else}
			<div class="has-text-info">
				<Button name={$_("new")} butn_submit={()=> modal = true}/>	
			</div>
			{/if}
		</div>
	</div>
</Borders>

<Modal canClose={true} bind:is_opened={modal} fit>
	<Box title={is_admin?$_("limits.system-limit"):$_("limits.limit")}>
		<div class="modal-content m-0 is-flex is-flex-direction-column is-align-items-center  mb-4">
			<Select bind:value={limit.type} items={typeItems} onChange={selectType} />
			{#if limit.type=="time"}
			<div class="is-inline-block mt-4 mb-1">
				<Select title={$_("limits.hours")} bind:value={time_h}  items={hoursItems} onChange={setTimeInput} />
				<Select title={$_("limits.minutes")} bind:value={time_m}  items={minItems} onChange={setTimeInput} />
			</div>
			{:else if limit.type=="energy"}
			<div class="slider">
				<SliderForm label={$_("limits.input-energy")} value={round(limit.value/1000,1)} min=0 max=100 unit={LimitTypes[limit.type].unit} step={1} onchange={setEnergyInput} />
			</div>
			{:else if limit.type=="soc"}
			<div class="slider">
				<SliderForm label={$_("limits.input-soc")} bind:value={limit.value} min=0 max=100 unit={LimitTypes[limit.type].unit} step={1} />
			</div>
			{:else if limit.type=="range"}
			<div class="slider">
				<SliderForm label={$_("limits.input-range")}  bind:value={limit.value} min=0 max=600 unit={LimitTypes[limit.type].unit} step={10} />
			</div>
			{/if}
			<div class="mt-2">
				<Button 
					name={$_("limits.set")} 
					bind:state={butn_set_state} 
					butn_submit={setLimit} 
					disabled={!limit.value} 
				/>
			</div>
		</div>
	</Box>
</Modal>
{/if}