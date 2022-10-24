<script>
	import Slider from "../ui/SliderForm.svelte"
	import Switch from "../ui/SwitchForm.svelte"
	import InputHalf from "../ui/InputHalfForm.svelte"
	import ButtonManual from "../ui/ButtonManual.svelte"
	import Checkbox from "../ui/Checkbox.svelte"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"
	import {override_store} from "../../lib/stores/override.js"
	import {status_store} from "../../lib/stores/status.js"
	import {schedule_store} from "../../lib/stores/schedule.js"
	import {uistates_store} from "../../lib/stores/uistates.js"
	import {uisettings_store} from "../../lib/stores/uisettings.js"
	import {onMount} from 'svelte'

	async function setMaxCurrent(val) {
		
		if (val == $config_store.max_current_soft) {
			//remove maxCurrent
			delete $claim_store.max_current
			let res
			// if not other properties, release claim
			if ( 
				$claim_store.state == undefined && 
				$claim_store.energy_limit == undefined && 
				$claim_store.time_limit == undefined
			) {
				res = await claim_store.releaseClaim()
			}
			else res = await claim_store.setClaim($claim_store)
			$uistates_store.max_current = val
			return res
		}
		else {
			// set claim
			$claim_store.max_current = val
			$claim_store.auto_release = $uisettings_store.auto_release
			let res = await claim_store.setClaim($claim_store)
			$uistates_store.max_current = val
			return res
		}
	}

	function getMaxCurrent() {
		if ($claim_store.max_current)
			return $claim_store.max_current
		else if ($config_store.max_current_soft)
			return $config_store.max_current_soft
	}

	function getMode() {
		if ($claim_store.state != undefined) {
			switch ($claim_store.state) {
				case "active":
					$uistates_store.mode = 1 // On
					break
				case "disabled":
					$uistates_store.mode = 2 // Off
					break;
				default: 
					break
			}
			if ($claim_store.auto_release != undefined) {
				$uisettings_store.auto_release = $claim_store.auto_release
			}
		}
		else {
			$uistates_store.mode = 0 // Auto
		}
	}

	function setMode(m) {
		$uistates_store.mode = m
		let data = {
				auto_release: $uisettings_store.auto_release
			}

		// keep max_current claim	
		if ($claim_store.max_current != undefined) {
				data.max_current = $claim_store.max_current
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

		if(data.state != undefined) {
			// Mode Manual setting override
			if ($claim_store.time_limit != undefined) {
				data.time_limit = $claim_store.time_limit
			}
			if ($claim_store.charge_limit != undefined) {
				data.charge_limit = $claim_store.charge_limit
			}

			claim_store.setClaim(data)
		}
		else {
			// Mode Auto
			// if there's no other claim property but charge_limit & time_limit ( no limit in Auto)
			if ($claim_store.max_current) 
				claim_store.setClaim(data)
			// Mode Auto, clearing override
			else 
				claim_store.releaseClaim()
		}
	}


	async function stateButtonWatcher() {
		if ($status_store.manual_override != undefined && $uistates_store.data_loaded == true ) {
			if ($status_store.manual_override != $uistates_store.manual_override && $uistates_store.manual_override != undefined) {
				// get latest claim
				await claim_store.getClaim()
				$uistates_store.mode = ($claim_store.state == undefined?0:($claim_store.state=="active"?1:2))
				$uistates_store.manual_override = $status_store.manual_override
			}
		}
		
	}

	function set_uistates_max_current() {
		$uistates_store.max_current = getMaxCurrent()
	}

	onMount( () => {
		$uistates_store.manual_override = $status_store.manual_override
		set_uistates_max_current() 
		getMode()
	})

// ## Triggers ##
$: $claim_store.max_current, set_uistates_max_current()
// 
$: $status_store.manual_override, stateButtonWatcher() 
	

</script>

<div class="is-unselectable">	
	<div class="is-size-4 has-text-weight-bold ">Manual</div>
	{#key $uistates_store.mode}
		{#if $schedule_store.length}
		<ButtonManual isauto={true} mode={$uistates_store.mode} setmode={setMode} />
		{:else}
		<ButtonManual isauto={false} mode={$uistates_store.mode} setmode={setMode} />
		{/if}
	{/key}
	<Switch name="swAutoRelease" label="Auto Release" bind:checked={$uisettings_store.auto_release} 
			tooltip="Settings will be reset to default after this charge session" />
	<div>
		<Slider  label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 
		value={$uistates_store.max_current} onchange={(value) => setMaxCurrent(value)} />
		<div class="columns is-mobile">
		<div class="column is-half {$config_store.current_shaper_enabled == false?"is-hidden":""}">
			<Switch name="man-swShaper" label="Current Shaper" checked={$status_store.shaper == true ?true:false} 
			tooltip={$status_store.shaper == true?"Disable Current Shaper":"Enable Current Shaper"} />
		</div>
		<div class="column is-half {$config_store.divert_enabled == false?"is-hidden":""}">
			<Switch name="man-swDivert" label="Eco/Divert" checked={$status_store.divertmode == 2?true:false} 
			tooltip={$status_store.divertmode == 2?"Disable Eco / Solar Divert mode":"Enable Eco / Solar Divert mode"} />
		</div>
		</div>

		<div class="columns is-mobile">
				<InputHalf label="Time Limit" value={$claim_store.time_lmt} type="number" placeholder="min / 15" 
				disabled={$uistates_store.mode==2?true:false} />
				<InputHalf label="Charge Limit" value={$claim_store.charge_lmt} type="number" placeholder="in kWh" 
				disabled={$uistates_store.mode==2?true:false}/>			
		</div>
	</div>
</div>