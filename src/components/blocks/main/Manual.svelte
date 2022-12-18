<script>
	import ToggleButtonIcon 		from "./../../ui/ToggleButtonIcon.svelte"
	import {EvseClients} 			from  "./../../../lib/vars.js"
	import { claims_target_store }	from "./../../../lib/stores/claims_target.js"
	import Box 						from "../../ui/Box.svelte"
	import Slider 					from "../../ui/SliderForm.svelte"
	import ButtonManual 			from "../../ui/ButtonManual.svelte"
	import SelectTimeLmt 			from "../../ui/SelectTimeLmt.svelte"
	import SelectChargeLmt			from "../../ui/SelectChargeLmt.svelte"
	import {config_store}			from "../../../lib/stores/config.js"
	import {claims_store} 			from "../../../lib/stores/claims.js"
	import { override_store } 		from "./../../../lib/stores/override.js";
	import {status_store} 			from "../../../lib/stores/status.js"
	import {schedule_store} 		from "../../../lib/stores/schedule.js"
	import {uistates_store} 		from "../../../lib/stores/uistates.js"
	import {uisettings_store} 		from "../../../lib/stores/uisettings.js"
	import {onMount} 				from 'svelte'
	import {httpAPI}	 			from '../../../lib/utils.js'
	import { serialQueue }			from "./../../../lib/queue.js";
	import RemovableTag 			from "../../ui/RemovableTag.svelte"

	let setamp_tag
	let buttons_manual
	let button_divert
	let button_shaper

	async function setChgCurrent(val) {
		$uistates_store.charge_current = val
		if (val == $config_store.max_current_soft) {
			//remove claim
			delete $override_store.charge_current
			let res
			// if no other properties, release override
			if ( 
				$override_store.state == undefined && 
				$override_store.energy_limit == undefined && 
				$override_store.time_limit == undefined
			) {
				if ($status_store.manual_override) {
					res = await override_store.clear()
				}
			}
			else res = await serialQueue.add(() => override_store.upload($override_store))
			$uistates_store.charge_current = val
			return res
		}
		else {
			// set override
			$override_store.charge_current = val
			$override_store.auto_release = $uisettings_store.auto_release
			let res = await serialQueue.add(() => override_store.upload($override_store))
			$uistates_store.charge_current = val
			return res
		}
	}

	function getChgCurrent() {
		if ($claims_target_store.properties.charge_current)
			return ($claims_target_store.properties.charge_current)
		else if ($config_store.max_current_soft)
			return $config_store.max_current_soft
		else return 0
	}


	async function setMode(m) {
		$uistates_store.mode = m
		// disabling buttons to prevent overlapping orders
		buttons_manual.disabled = true
		let data = {
				auto_release: $uisettings_store.auto_release
			}

		// keep charge_current claim	
		if ($claims_target_store.claims.charge_current == EvseClients["manual"]) {
				data.charge_current = $claims_target_store.properties.charge_current
			}
		switch(m) {
			case 0: break
			case 1: 
				data.state = "active"
				break
			case 2:
				data.state = "disabled"
				break
			default: break
		}

		if(data.state != undefined ) {
			// Mode Manual setting override
			if ($override_store.time_limit != undefined) {
				data.time_limit = $override_store.time_limit
			}
			if ($override_store.charge_limit != undefined) {
				data.charge_limit = $override_store.charge_limit
			}
			await serialQueue.add(() => override_store.upload(data))
		}
		else {
			// if there's no other claim property ( only charge_current for now )
			if (data.charge_current) 
				await serialQueue.add(() => override_store.upload(data))
			// Mode Auto, clearing override
			else if ($claims_target_store.claims.state == EvseClients["manual"] ) {
				if ($status_store.manual_override) { 
					let res = await serialQueue.add(override_store.clear)
				}
			}
		}
		buttons_manual.disabled = false
	}

	async function setShaper(state) {
		state = state == true ? "1" : "0"
		let param = "shaper="+state
		if (state != $status_store.shaper && $status_store.shaper != undefined) {
			
			let res = await serialQueue.add(() => httpAPI("POST","/shaper", param, "text"))
		}
		if (button_shaper)
			button_shaper.blur()
	}

	async function setDivertMode(state) {
		state = state == true ? "2" : "1"
		let param = "divertmode="+state
		if (state != $status_store.divertmode && $status_store.divertmode != undefined) {
			let res = await serialQueue.add(() => httpAPI("POST","/divertmode", param, "text"))
		}
		if (button_divert)
			button_divert.blur()
	}

	async function stateButtonWatcher(val) {
		if (val != undefined && $uistates_store.data_loaded == true ) {
			if (val != $uistates_store.manual_override) {
				$uistates_store.manual_override = val
			}
		}
		
	}

	function set_uistates_charge_current() {
		$uistates_store.charge_current = getChgCurrent()
	}	
	function set_uistates_shaper(val) {
		val = val == 1?true:false
		if ($uistates_store.shaper != val)
			$uistates_store.shaper = val
	}
	function set_uistates_divertmode(val) {
		val = val == 2?true:false
		if ($claims_target_store.claims.state == EvseClients.timer && $claims_target_store.properties.state == "active")
				$uistates_store.divertmode = false
	    else
			$uistates_store.divertmode = val		
	}

	async function removeProp(prop,tag) {
		tag.state = "loading"
		let client = $claims_target_store.claims[prop]
		let res
		if (client == EvseClients["manual"]) {
			// remove props using /override else use /claims
			res = await serialQueue.add(() =>override_store.removeProp(prop))
		}
		else {
			res = await serialQueue.add(() =>claims_store.removeClaimProp($claims_target_store.claims[prop],prop))
		}
		if (res) tag.state = "ok"
		else tag.state = "error"
	}

	onMount( () => {
		$uistates_store.manual_override = $status_store.manual_override
		set_uistates_charge_current()
	})


// ## Reactive functions ##
$: $claims_target_store.properties.charge_current, set_uistates_charge_current()
$: stateButtonWatcher($status_store.manual_override) 
$: set_uistates_shaper($status_store.shaper)
$: setShaper($uistates_store.shaper)
$: set_uistates_divertmode($status_store.divertmode)
// $: setDivertMode($uistates_store.divertmode)

</script>

<Box title="Charge" icon="fa6-solid:bolt">
	<div class="has-text-centered mt-5 mb-0 pb-0 has-text-weight-bold has-text-info">EVSE STATE</div>
	<!-- <div class="mb-4 is-italic is-size-7 has-text-left">Temporary override default settings (doesn't survive power cycle)</div> -->
	{#if $config_store.rfid_enabled}
	<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={!$config_store.rfid_auth} breakpoint={$uistates_store.breakpoint} ischarging={$uistates_store.charging}/>
	{:else if $schedule_store.length || $status_store.divertmode == 2 || $status_store.ocpp_connected == 1}
	<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} breakpoint={$uistates_store.breakpoint} ischarging={$uistates_store.charging}/>
	{:else}
	<ButtonManual bind:this={buttons_manual} isauto={false} mode={$uistates_store.mode} setmode={setMode} breakpoint={$uistates_store.breakpoint} ischarging={$uistates_store.charging}/>
	{/if}

	<div class="is-flex is-justify-content-center my-5">
		<ToggleButtonIcon visible={$config_store.divert_enabled} bind:button={button_divert} state={$uistates_store.divertmode} name={$uistates_store.divertmode == 1?"ECO":"Normal"} color="is-primary" 
			tooltip={$uistates_store.divertmode?"Disable Eco mode":"Enable Eco mode"} icon="fa6-solid:solar-panel" breakpoint={$uistates_store.breakpoint}
			action={() => setDivertMode(!$uistates_store.divertmode)} disabled={$claims_target_store.claims.state == EvseClients.timer && $claims_target_store.properties.state == "active"}/>
		<ToggleButtonIcon  visible={$config_store.current_shaper_enabled} bind:button={button_shaper} state={$uistates_store.shaper} name="SHAPER" color="is-info" 
			tooltip={ $uistates_store.shaper?"Disable Shaper":"Enable Shaper"} icon="fa6-solid:building-shield" breakpoint={$uistates_store.breakpoint}
			action={() => setShaper(!$uistates_store.shaper)} />
		</div>

	<div class="container ">
		<Slider icon="fa6-solid:gauge-high" tooltip="Adjust Charge Rate" unit="A" min=6 max={$config_store.max_current_soft} step={1} label="CHARGE RATE"
		bind:value={$uistates_store.charge_current} onchange={(value) => setChgCurrent(value)} />
		{#key $claims_target_store.claims.charge_current}
		{#if $claims_target_store.claims.charge_current && $claims_target_store.properties.charge_current < $config_store.max_current_soft && $claims_target_store.claims.charge_current != EvseClients.timer}
		<div class="is-flex is-justify-content-center is-align-content is-vcentered">
			<RemovableTag bind:this={setamp_tag} client={$claims_target_store.claims.charge_current} action={()=>removeProp("charge_current",setamp_tag)} />
		</div>
		{/if}
		{/key}
	</div>

	<div class="columns is-mobile is-justify-content-center is-align-content pt-2 my-4">
		<SelectTimeLmt title="TIME LIMIT" bind:value={$uistates_store.time_lmt} disabled={true}/>
		<SelectChargeLmt title="ENERGY LIMIT" bind:value={$uistates_store.charge_lmt} disabled={true}/>
		<!-- <SelectTimeLmt title="Time Limit" bind:value={$uistates_store.time_lmt} disabled={$uistates_store.charge_lmt!=0?true:false}/>
		<SelectChargeLmt title="Energy Limit" bind:value={$uistates_store.charge_lmt} disabled={$uistates_store.time_lmt!=0?true:false}/>	 -->
	</div>
	<!-- <div class="is-flex is-justify-content-left mt-2">
		<Switch name="swAutoRelease" label="Clear on disconnect" bind:checked={$uisettings_store.auto_release} 
		tooltip="Clear charge session settings when vehicle is unplugged"  />
	</div> -->
</Box>