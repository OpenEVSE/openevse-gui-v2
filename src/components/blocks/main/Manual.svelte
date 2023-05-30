<script>
	import { _ } 					from 'svelte-i18n'
	import {config_store}			from "./../../../lib/stores/config.js"
	import {claims_store} 			from "./../../../lib/stores/claims.js"
	import {override_store} 		from "./../../../lib/stores/override.js";
	import {status_store} 			from "./../../../lib/stores/status.js"
	import {uistates_store} 		from "./../../../lib/stores/uistates.js"
	import {uisettings_store} 		from "./../../../lib/stores/uisettings.js"
	import {EvseClients} 			from "./../../../lib/vars.js"
	import {claims_target_store}	from "./../../../lib/stores/claims_target.js"
	import {onMount} 				from 'svelte'
	import {httpAPI,
			clientid2name}			from './../../../lib/utils.js'
	import { serialQueue }			from "./../../../lib/queue.js";
	import Borders 					from "./../../ui/Borders.svelte";
	import Limit 					from "./Limit.svelte";
	import Box 						from "./../../ui/Box.svelte"
	import ToggleButtonIcon 		from "./../../ui/ToggleButtonIcon.svelte"
	import Slider 					from "./../../ui/SliderForm.svelte"
	import ButtonManual 			from "../../ui/ButtonManual.svelte"
	import RemovableTag 			from "../../ui/RemovableTag.svelte"

	let setamp_tag
	let buttons_manual
	// let button_divert
	let button_shaper
	let waiting = false
	let mounted = false

	async function setChgCurrent(val) {
		if (val == $status_store.max_current && $uistates_store.mode == 0) {
			let res
			// if no other properties than charge_current, release override in mode Auto
			if ( 
				$override_store.state == undefined && 
				$override_store.max_current == undefined &&
				$override_store.auto_release == false
			) {
				if ($override_store.charge_current != undefined) {
					waiting = true
					res = await serialQueue.add(() => override_store.clear())
					waiting = false
				}
			}
			else {
				//remove charge_current as equal to max_current_soft
				delete $override_store.charge_current
				res = await serialQueue.add(() => override_store.upload($override_store))
			}
			return res
		}
		else {
			// set override
			$override_store.charge_current = val
			$override_store.auto_release = $uisettings_store.auto_release
			waiting = true
			let res = await serialQueue.add(() => override_store.upload($override_store))
			waiting = false
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
		// disabling buttons to prevent overlapping commands
		buttons_manual.disabled = true
		switch(m) {
			case 0: 
				await serialQueue.add(() => override_store.clear())
				break
			case 1:
			case 2:
				let data = {
					state: m==1?"active":"disabled"
				}
				if ($override_store?.charge_current != undefined)
					data.charge_current = $override_store.charge_current
				else 
					data.charge_current = $config_store.max_current_soft
				await serialQueue.add(() => override_store.upload(data))
				break
			default: 
				break
		}
		buttons_manual?buttons_manual.disabled = false:null
	}

	async function setShaper(state) {
		state = state == true ? "1" : "0"
		let param = "shaper="+state
		if (state != $status_store.shaper && $status_store.shaper != undefined) {
			waiting = true
			let res = await serialQueue.add(() => httpAPI("POST","/shaper", param, "text"))
			waiting = false
		}
		if (button_shaper)
			button_shaper.blur()
	}

	async function setDivertMode(mode) {
		if (mode != $status_store.divertmode) {
			$status_store.divertmode = mode
			waiting = true
			let data = "divertmode=" + mode
			await serialQueue.add(() => httpAPI("POST", "/divertmode", data, "text"))
			waiting = false
		}
	}

	function set_uistates_shaper(val) {
		val = val == 1?true:false
		if ($uistates_store.shaper != val)
			$uistates_store.shaper = val
	}

	async function removeProp(prop,tag) {
		tag.state = "loading"
		let client = $claims_target_store.claims[prop]
		let res
		if (client == EvseClients["manual"].id) {
			// remove props using /override else use /claims
			waiting = true
			res = await serialQueue.add(() =>override_store.removeProp(prop))
			waiting = false
		}
		else {
			waiting = true
			res = await serialQueue.add(() =>claims_store.removeClaimProp($claims_target_store.claims[prop],prop))
			waiting = false
		}
		tag.state = ""
	}

	onMount( () => {
		mounted = true
	})


// ## Reactive functions ##
$: set_uistates_shaper($status_store.shaper)
$: setShaper($uistates_store.shaper)

</script>

<style>
	.slider-div{
		position: relative;
		top: -10px;
		height: 70px;
	}
	.tag-div {
		position: relative;
		bottom:6px;
	}
</style>

{#if mounted}
<Box title={$_("charge-title")} icon="fa6-solid:bolt">
	<div class="is-flex is-align-items-center is-flex-direction-column">
		<div class="has-text-centered mb-0 pb-0 has-text-weight-bold has-text-dark mt-2 is-uppercase">{$_("charge-toggle")}</div>
		<!-- <div class="mb-4 is-italic is-size-7 has-text-left">Temporary override default settings (doesn't survive power cycle)</div> -->
		{#if $claims_target_store.claims.state == EvseClients["rfid"].id}
		<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={!$config_store.rfid_auth || waiting} ischarging={$uistates_store.charging}/>
		{:else if $claims_target_store.claims.state == EvseClients["ocpp"].id}
		<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={true} ischarging={$uistates_store.charging}/>
		{:else if $claims_target_store.claims.state == EvseClients["limit"].id}
		<ButtonManual bind:this={buttons_manual} isauto={true} mode={0} setmode={setMode} disabled={true} ischarging={false}/>
		{:else}
		<ButtonManual bind:this={buttons_manual} isauto={true} mode={$uistates_store.mode} setmode={setMode} disabled={waiting} ischarging={$uistates_store.charging}/>
		{/if}
	
		<div class="is-flex is-justify-content-center my-0 mb-2">
			<ToggleButtonIcon 
				visible={$config_store.divert_enabled} 
				state={$status_store.divertmode == 2 && $uistates_store.mode == 0 ?true:false} 
				name={$_("charge-mode-eco")}
				color="is-primary"
				color2="is-primary"
				tooltip={$status_store.divertmode==2?$_("charge-mode-fast-ttip"):$_("charge-mode-eco-ttip")} 
				icon="fa6-solid:solar-panel" 
				size={20} size2={26} 
				breakpoint={$uistates_store.breakpoint}
				action={() => setDivertMode($status_store.divertmode == 2 ? 1 : 2)} 
				disabled={waiting||$uistates_store.mode != 0}
			/>
			<ToggleButtonIcon
				visible={$config_store.current_shaper_enabled} 
				bind:button={button_shaper} 
				state={$uistates_store.shaper} 
				name={$_("charge-shaper")} 
				size={20} 
				color="is-info" 
				tooltip={ $uistates_store.shaper?$_("charge-shaper-disable"):$_("charge-shaper-enable")} 
				icon="fa6-solid:building-shield" 
				breakpoint={$uistates_store.breakpoint}
				action={() => setShaper(!$uistates_store.shaper)} 
				disabled={waiting} 
			/>
		</div>
		<Borders grow>
			<div class="is-size-6 has-text-dark has-text-weight-bold mb-2">
				{$_("charge-rate-label")} 
			</div>
			<div class="slider-div" style="width: 260px;">

				<Slider 
					icon="fa6-solid:gauge-high" 
					tooltip={$_("charge-rate-ttip")} 
					unit="A" min=6 max={$config_store.max_current_soft} step={1} 
					disabled={EvseClients[clientid2name($claims_target_store.claims?.charge_current)]?.priority > EvseClients.manual.priority || waiting || $status_store.divertmode == 2} 
					value={$claims_target_store.properties?.charge_current?$claims_target_store.properties.charge_current<$config_store.max_current_soft?$claims_target_store.properties.charge_current:$config_store.max_current_soft:$config_store.max_current_soft}
					onchange={(value) => setChgCurrent(value)} 
				/>
				{#if $claims_target_store?.claims?.charge_current && $claims_target_store.claims.charge_current != EvseClients.timer.id}
				<div class="tag-div is-flex is-justify-content-center is-align-content">
					<RemovableTag 
						bind:this={setamp_tag} 
						client={$claims_target_store.claims.charge_current} 
						nobutton={$uistates_store.mode != 0}
						action={()=>removeProp("charge_current",setamp_tag)} 
					/>
				</div>
				{/if}
			</div>
		</Borders>
		<Limit />
	</div>
</Box>
{/if}