<script>
	import ToggleButtonIcon 		from "./../../ui/ToggleButtonIcon.svelte"
	import Fa 						from 'svelte-fa/src/fa.svelte'
	import {faSolarPanel,
			faGaugeHigh,
			faBuildingShield} 		from '@fortawesome/free-solid-svg-icons/index.js'
	import {EvseClients} 			from  "./../../../lib/vars.js"
	import { claims_target_store }	from "./../../../lib/stores/claims_target.js"
	import Box 						from "../../ui/Box.svelte"
	import Slider 					from "../../ui/SliderForm.svelte"
	import Switch 					from "../../ui/Switch.svelte"
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
	import {httpAPI,
			clientid2name,
			displayIcon} 			from '../../../lib/utils.js'
	import { serialQueue }			from "./../../../lib/queue.js";
	import ClaimPropTag 			from "../../ui/ClaimPropTag.svelte"

	let setamp_tag
	let buttons_manual
	let button_divert
	let button_shaper

	async function setMaxCurrent(val) {
		
		if (val == $config_store.max_current_soft) {
			//remove maxCurrent
			delete $override_store.max_current
			let res
			// if no other properties, release claim
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
			$uistates_store.max_current = val
			return res
		}
		else {
			// set override
			$override_store.max_current = val
			$override_store.auto_release = $uisettings_store.auto_release
			let res = await serialQueue.add(() => override_store.upload($override_store))
			$uistates_store.max_current = val
			return res
		}
	}

	function getMaxCurrent() {
		// if ($override_store.max_current!=undefined)
		// 	return $override_store.max_current
		// else if ($config_store.max_current_soft)
		// 	return $config_store.max_current_soft
		if ($claims_target_store.properties.max_current)
			return ($claims_target_store.properties.max_current)
		else if ($config_store.max_current_soft)
			return $config_store.max_current_soft
		else return 0
	}


	async function setMode(m) {
		$uistates_store.mode = m
		// disabling buttons to prevent crossing orders
		buttons_manual.disabled = true
		let data = {
				auto_release: $uisettings_store.auto_release
			}

		// keep max_current claim	
		if ($claims_target_store.claims.max_current == EvseClients["manual"]) {
				data.max_current = $claims_target_store.properties.max_current
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
			if (data.max_current) 
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

	function set_uistates_max_current() {
		$uistates_store.max_current = getMaxCurrent()
	}	
	function set_uistates_shaper(val) {
		val = val == 1?true:false
		if ($uistates_store.shaper != val)
			$uistates_store.shaper = val
	}
	function set_uistates_divertmode(val) {
		val = val == 2?true:false
		if ($uistates_store.divertmode != val)
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
			console.log("removeclaimsprop")
			res = await serialQueue.add(() =>claims_store.removeClaimProp($claims_target_store.claims[prop],prop))
		}
		if (res) tag.state = "ok"
		else tag.state = "error"
	}

	onMount( () => {
		$uistates_store.manual_override = $status_store.manual_override
		set_uistates_max_current()
	})


// ## Reactive functions ##
$: $claims_target_store.properties.max_current, set_uistates_max_current()
$: stateButtonWatcher($status_store.manual_override) 
$: set_uistates_shaper($status_store.shaper)
$: setShaper($uistates_store.shaper)
$: set_uistates_divertmode($status_store.divertmode)
$: setDivertMode($uistates_store.divertmode)

</script>
<style>
	.item {
    position:relative;
    top:-15px;
}
</style>

<Box title="Charge">
	<div class="mb-4 is-italic is-size-7 has-text-left">Temporary override default settings (doesn't survive power cycle)</div>
	{#if $config_store.rfid_enabled}
	<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={!$config_store.rfid_auth} breakpoint={$uistates_store.breakpoint}/>
	{:else if $schedule_store.length || $status_store.divertmode == 2 || $status_store.ocpp_connected == 1}
	<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} breakpoint={$uistates_store.breakpoint}/>
	{:else}
	<ButtonManual bind:this={buttons_manual} isauto={false} mode={$uistates_store.mode} setmode={setMode} breakpoint={$uistates_store.breakpoint}/>
	{/if}

	<div class="is-flex is-justify-content-center">
		<ToggleButtonIcon visible={$config_store.divert_enabled} bind:button={button_divert} state={$uistates_store.divertmode} name="ECO" color="is-primary" 
			tooltip={$uistates_store.divertmode?"Disable Eco Divert mode":"Enable Eco Divert mode"} icon={faSolarPanel} breakpoint={$uistates_store.breakpoint}
			action={() => setDivertMode(!$uistates_store.divertmode)} />
		<ToggleButtonIcon  visible={$config_store.current_shaper_enabled} bind:button={button_shaper} state={$uistates_store.shaper} name="Shaper" color="is-info" 
			tooltip={ $uistates_store.shaper?"Disable Adaptive Power":"Enable Adaptive Power"} icon={faBuildingShield} breakpoint={$uistates_store.breakpoint}
			action={() => setShaper(!$uistates_store.shaper)} />
		</div>

	<div class="container ">
		<Slider  icon={faGaugeHigh} tooltip="Adjust Charge Rate" unit="A" min=6 max={$config_store.max_current_soft} step=1 
		value={$uistates_store.max_current} onchange={(value) => setMaxCurrent(value)} />
		{#key $claims_target_store.claims.max_current}
		{#if $claims_target_store.claims.max_current}
		<div class="is-flex is-justify-content-center is-align-content is-vcentered">
			<ClaimPropTag bind:this={setamp_tag} client={$claims_target_store.claims.max_current} action={()=>removeProp("max_current",setamp_tag)} />
		</div>
		{/if}
		{/key}
	</div>


	<div class="columns is-mobile is-justify-content-center is-align-content pt-2 mt-4">
		<SelectTimeLmt title="Time Limit" bind:value={$uistates_store.time_lmt} disabled={$uistates_store.charge_lmt!=0?true:false}/>
		<SelectChargeLmt title="Energy Limit" bind:value={$uistates_store.charge_lmt} disabled={$uistates_store.time_lmt!=0?true:false}/>	
	</div>
	<div class="is-flex is-justify-content-left mt-2">
		<Switch name="swAutoRelease" label="Auto Release" bind:checked={$uisettings_store.auto_release} 
		tooltip={"Release settings when vehicle is plugued off"}  />
	</div>
</Box>