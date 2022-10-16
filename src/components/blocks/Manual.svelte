<script>
	import Slider from "../ui/SliderForm.svelte"
	import Switch from "../ui/SwitchForm.svelte"
	import InputHalf from "../ui/InputHalfForm.svelte"
	import ButtonManual from "../ui/ButtonManual.svelte"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"
	import {states_store} from "../../lib/stores/states.js"
	import {onMount} from 'svelte'

	let man_data = {
		shaper: {
			state: true,
		},
		divert: {
			state: false,
		},
		time_lmt: null,
		charge_lmt: null,
	}
	let conf_data = {
		current_shaper_enabled: true,
		divert_enabled: true
	}

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
			$states_store.max_current = val
			return res
		}
		else {
			// set claim
			$claim_store.max_current = val
			$claim_store.auto_release = $states_store.auto_release
			let res = await claim_store.setClaim($claim_store)
			$states_store.max_current = val
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
					$states_store.mode = 1 // On
					break
				case "disabled":
					$states_store.mode = 2 // Off
					break;
				default: 
					break
			}
			if ($claim_store.auto_release != undefined) {
				$states_store.auto_release = $claim_store.auto_release
			}
		}
		else {
			$states_store.mode = 0 // Auto
		}
	}

	function setMode(m,a) {
		$states_store.mode = m
		$states_store.auto_release = a
		let state
		let data = {
				state: state,
				auto_release: a
			}
		// keep max_current claim	
		if ($claim_store.max_current != undefined) {
				data.max_current = $claim_store.max_current
			}

		switch(m) {
			case 0: break
			case 1: 
				state = "active"
				break
			case 2:
				state = "disabled"
				break
			default: break
		}
		
		if(state) {
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
			// if there's no other claim property but charge_limit & time_limit ( no limit in Auto)
			if ($claim_store.max_current) 
				claim_store.setClaim(data)
			// Mode Auto, clearing override
			else 
				claim_store.releaseClaim()
		}
	}

	function setTimeLimit(t) {
		// Claim a time limit
		// TO DO


	}

	function setChargeLimit(c) {
		// Claim a charge limit
		// TO DO 

	}

	onMount( () => {
		$states_store.max_current = getMaxCurrent()
		getMode()
	})

$: $states_store.max_current = $claim_store.max_current?$claim_store.max_current:$config_store.max_current_soft


</script>


<div class="is-unselectable">	
	<div class="is-size-4 has-text-weight-bold ">Manual</div>
	<ButtonManual mode={$states_store.mode} setmode={setMode} bind:checked={$states_store.auto_release} />
	<div>
		<Slider  id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 value={$states_store.max_current} onchange={(value) => setMaxCurrent(value)} />
			<div class="columns is-mobile">
			<div class="column is-half {!conf_data.current_shaper_enabled?"is-hidden":""}">
				<Switch name="man-swShaper" label="Current Shaper" bind:checked={man_data.shaper.state} tooltip={man_data.shaper.state?"Disable Current Shaper":"Enable Current Shaper"} />
			</div>
			<div class="column is-half {!conf_data.divert_enabled?"is-hidden":""}">
				<Switch name="man-swDivert" label="Eco/Divert" bind:checked={man_data.divert.state} tooltip={man_data.divert.state?"Disable Eco / Solar Divert mode":"Enable Eco / Solar Divert mode"} />
			</div>
		</div>

		<div class="columns is-mobile">
				<InputHalf label="Time Limit" value={man_data.time_lmt} type="number" placeholder="in minutes" disabled={$states_store.mode==2?true:false} />
				<InputHalf label="Charge Limit" value={man_data.charge_lmt} type="number" placeholder="in kWh" disabled={$states_store.mode==2?true:false}/>			
		</div>
	</div>
</div>