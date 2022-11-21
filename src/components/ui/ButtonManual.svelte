<script>
	import Fa from 'svelte-fa'
	import {faRobot, faBolt, faBan} from '@fortawesome/free-solid-svg-icons/index.js'
	export let mode // 0: Auto, 1: On, 2: OFF
	export let ischarging = false
	export let setmode = (m,c) => {}
	export let isauto = false
	export let disabled = false
	export let breakpoint = "mobile"

	let mode1 = "ON"
	let mode2 = "OFF"

	
</script>

<style>
	.manual-charge {
		margin: 0
	}
	.buttonblock {
		width: fit-content; 	
	}
	.no-pointer {
		cursor: default;
		pointer-events: hover;
	}
</style>

<svelte:options accessors/>
<div class="mt-2 is-flex is-flex-wrap-nowrap buttonblock mx-auto buttons field is-grouped has-addons">
	<button {disabled} class="{mode==1 || disabled?"no-pointer":""} {mode == 1?"":"is-outlined"} 
		{breakpoint=="mobilemini"?"":breakpoint=="desktop"?"is-large":"is-medium"} 
		button  manual-charge has-tooltip-arrow is-primary {mode == 1 && ischarging?"has-text-warning":""}"
		data-tooltip={disabled?null:"Enable Charge"}
		on:click|preventDefault={() => {setmode(1)}}>
		&nbsp;&nbsp;&nbsp;<Fa size=1.6x icon={faBolt} />&nbsp;&nbsp;&nbsp;
	</button>
	{#if isauto}
	<button {disabled} class="{mode==0 || disabled?"no-pointer":""} {mode == 0?"":"is-outlined"}
		{breakpoint=="mobilemini"?"":breakpoint=="desktop"?"is-large":"is-medium"} 
		button manual-charge has-tooltip-arrow is-info {mode == 0 && ischarging?"has-text-warning":""}" 
		data-tooltip={disabled?null:"Let OpenEVSE decide"}
		on:click|preventDefault={() => { setmode(0)}}>
		&nbsp;&nbsp;&nbsp;<Fa size=1.6x icon={faRobot} class=""/>&nbsp;&nbsp;&nbsp;
	</button>
	{/if}
	<button {disabled} class="{mode==2 || disabled?"no-pointer":""} {mode == 2?"":"is-outlined "} 
		{breakpoint=="mobilemini"?"":breakpoint=="desktop"?"is-large":"is-medium"} 
		button manual-charge has-tooltip-arrow is-danger" 
		 data-tooltip={disabled?null:"Disable Charge"}
		on:click|preventDefault={() => { setmode(2)}}>
		&nbsp;&nbsp;&nbsp;<Fa size=1.6x icon={faBan} />&nbsp;&nbsp;&nbsp;
	</button>
</div>