<script>
	import Fa from 'svelte-fa'
	import {faRobot, faBolt, faBan} from '@fortawesome/free-solid-svg-icons/index.js'
	export let mode // 0: Auto, 1: On, 2: OFF
	export let ischarging = false
	export let setmode = (m,c) => {}
	export let isauto = false
	export let disabled = false

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

<div class="mb-2 mt-2 mb-5  is-flex is-flex-wrap-nowrap buttonblock mx-auto buttons field is-grouped">
	<button {disabled} class="{mode==1 || disabled?"no-pointer":""} {mode == 1?"is-active":"is-outlined"} mr-1 button is-large manual-charge has-tooltip-arrow {ischarging?"has-text-warning":""} is-primary" data-tooltip="Enable Charge"
	on:click={() => {setmode(1)}}>
		&nbsp;&nbsp;&nbsp;
		<Fa size=2x icon={faBolt} />
		
		&nbsp;&nbsp;&nbsp;
	</button>
	{#if isauto}
	<button {disabled} class="{mode==0 || disabled?"no-pointer":""} {mode == 0?"is-active":"is-outlined"} mr-1 button is-large manual-charge has-tooltip-arrow is-info" data-tooltip="Let OpenEVSE decide"
			on:click={() => { setmode(0)}}>&nbsp;&nbsp;&nbsp;<Fa size=1.6x icon={faRobot}/>&nbsp;&nbsp;&nbsp;
	</button>
	{/if}
	<button {disabled} class="{mode==2 || disabled?"no-pointer":""} {mode == 2?"is-active":"is-outlined "} button is-large manual-charge has-tooltip-arrow is-danger" data-tooltip="Disable Charge"
			on:click={() => { setmode(2)}}>&nbsp;&nbsp;&nbsp;
			<Fa size=2x icon={faBan} />
			&nbsp;&nbsp;&nbsp;
	</button>
</div>