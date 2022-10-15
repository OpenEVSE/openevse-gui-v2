<script>
	import Slider from "../ui/SliderForm.svelte"
	import Switch from "../ui/SwitchForm.svelte"
	import InputHalf from "../ui/InputHalfForm.svelte"
	import ButtonManual from "../ui/ButtonManual.svelte"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"
	import {states_store} from "../../lib/stores/states.js"
	import {override_store} from "../../lib/stores/override.js"
	import {onMount} from 'svelte'



	let man_data = {
		shaper: {
			state: true,
		},
		divert: {
			state: false,
		},
		max_current: 32,
		time_lmt: null,
		charge_lmt: null,
	}
	let conf_data = {
		current_shaper_enabled: true,
		divert_enabled: true
	}

	async function setMaxCurrent(val) {
		
		if (val == $config_store.max_current_soft) {
			//release claim
			let res = await claim_store.releaseClaim()
			$states_store.states.max_current = val
			return res
		}
		else {
			// set claim
			$claim_store.max_current = val
			let res = await claim_store.setClaim($claim_store)
			$states_store.states.max_current = val
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
		if (typeof $override_store.state != undefined) {
			switch ($override_store.state) {
				case "active":
					$states_store.states.mode = 1 // On
					break
				case "disabled":
					$states_store.states.mode = 2 // Off
					break;
				default: break
			}
		}
		else $states_store.states.mode = 0 // Auto
	}

	function setMode(m) {
		$states_store.states.mode = m
		let state
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
			const data = {state: state}
			override_store.setOverride(data)
		}
		else {
			override_store.clearOverride()
		}
	}

	function setTimeLimit(t) {
		// Claim a time limit
		

	}

	function setChargeLimit(c) {

	}

	onMount( () => {
		$states_store.states.max_current = getMaxCurrent()
		getMode()
	})
	

</script>


<div class="is-unselectable">	
	<div class="is-size-4 has-text-weight-bold ">Manual</div>
	<ButtonManual mode={$states_store.states.mode} setmode={setMode}/>
	<div>
		<Slider  id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 value={$states_store.states.max_current} onchange={(value) => setMaxCurrent(value)} />
			<div class="columns is-mobile">
			<div class="column is-half {!conf_data.current_shaper_enabled?"is-hidden":""}">
				<Switch name="man-swShaper" label="Current Shaper" bind:checked={man_data.shaper.state} tooltip={man_data.shaper.state?"Disable Current Shaper":"Enable Current Shaper"} />
			</div>
			<div class="column is-half {!conf_data.divert_enabled?"is-hidden":""}">
				<Switch name="man-swDivert" label="Eco/Divert" bind:checked={man_data.divert.state} tooltip={man_data.divert.state?"Disable Eco / Solar Divert mode":"Enable Eco / Solar Divert mode"} />
			</div>
		</div>

		<div class="columns is-mobile">
				<InputHalf label="Time Limit" value={man_data.time_lmt} type="number" placeholder="in minutes" disabled={$states_store.states.mode==0?true:false} />
				<InputHalf label="Charge Limit" value={man_data.charge_lmt} type="number" placeholder="in kWh" disabled={$states_store.states.mode==0?true:false}/>			
		</div>
	</div>
</div>