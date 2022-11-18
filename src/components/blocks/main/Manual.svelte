<script>
	import ButtonRfidMode 			from "./../../ui/ButtonRfidMode.svelte";
	import Fa 						from 'svelte-fa/src/fa.svelte'
	import {EvseClients} 			from  "./../../../lib/vars.js"
	import { claims_target_store }	from "./../../../lib/stores/claims_target.js";
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
	import {httpAPI, clientid2name, displayIcon} 				from '../../../lib/utils.js'
	import { serialQueue }			from "./../../../lib/queue.js";

	async function setMaxCurrent(val) {
		
		if (val == $config_store.max_current_soft) {
			//remove maxCurrent
			delete $override_store.max_current
			let res
			// if not other properties, release claim
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
			// set claim
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
			if ($claims_target_store.claims.state == EvseClients["manual"] ) {
				if ($status_store.manual_override) { 
					let res = await serialQueue.add(override_store.clear)
				}
			}
		}
	}

	async function setShaper(state) {
		state = state == true ? "1" : "0"
		let param = "shaper="+state
		if (state != $status_store.shaper && $status_store.shaper != undefined) {
			
			let res = await serialQueue.add(() => httpAPI("POST","/shaper", param, "text"))
		}
	}

	async function setDivertMode(state) {
		state = state == true ? "2" : "1"
		let param = "divertmode="+state
		if (state != $status_store.divertmode && $status_store.divertmode != undefined) {
			let res = await serialQueue.add(() => httpAPI("POST","/divertmode", param, "text"))
		}
	}

	async function setAutoRelease(state) {
		let data = {auto_release: state}

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

	{#if $config_store.rfid_enabled}
	<!-- {#if true} -->
	<!-- <ButtonRfidMode mode={!$uistates_store.rfid_auth?0:$status_store.state!=3?1:2} auth={$uistates_store.rfid_auth} /> -->
	<ButtonManual isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={!$config_store.rfid_auth}/>
	{:else if $schedule_store.length || $status_store.divertmode == 2 || $status_store.ocpp_connected == 1}
	<ButtonManual isauto={true} mode={$uistates_store.mode} setmode={setMode} />
	{:else}
	<ButtonManual isauto={false} mode={$uistates_store.mode} setmode={setMode} />
	{/if}

	<div class="is-flex is-justify-content-center">
		<div class="is-flex mx-auto is-inline-block">
			<div>
				<Switch name="man-swDivert" label="ECO Mode" bind:checked={$uistates_store.divertmode} hidden={$config_store.divert_enabled == false?true:false}
				tooltip={$status_store.divertmode == 2?"Disable Eco / Solar Divert mode":"Enable Eco / Solar Divert mode"} />
			</div>
			<div>
				<Switch name="man-swShaper" label="Current Shaper" bind:checked={$uistates_store.shaper} hidden={$config_store.current_shaper_enabled == false?true:false} 
				tooltip={$uistates_store.shaper == true?"Disable Current Shaper":"Enable Current Shaper"}/>
			</div>
			<div>
				<Switch name="swAutoRelease" label="Auto Release" bind:checked={$uisettings_store.auto_release} 
				tooltip="Settings will be reset to default after this charge session" />
			</div>
		</div>
	</div>

	<Slider  label="Set Amp" tooltip="Restrain max current to this value" unit="A" min=6 max={$config_store.max_current_soft} step=1 
	value={$uistates_store.max_current} onchange={(value) => setMaxCurrent(value)} />
	{#if $claims_target_store.claims.max_current}
	<div class="is-flex is-justify-content-center">
		<div class="item ml-2 my-0 tag is-info has-text-weight-semibold">
			<Fa icon={displayIcon(clientid2name($claims_target_store.claims.max_current))} class="has-text-white mr-2 is-capitalized" />
			{clientid2name($claims_target_store.claims.max_current)}
			<button class="delete is-small" on:click={() => {claims_store.removeClaimProp($claims_target_store.claims.max_current,"max_current")}}></button>
		</div>
	</div>
	{/if}


	<div class="columns is-mobile is-justify-content-center mt-4">
		<SelectTimeLmt title="Time Limit" bind:value={$uistates_store.time_lmt} disabled={$uistates_store.charge_lmt!=0?true:false}/>
		<SelectChargeLmt title="Energy Limit" bind:value={$uistates_store.charge_lmt} disabled={$uistates_store.time_lmt!=0?true:false}/>	
	</div>
</Box>