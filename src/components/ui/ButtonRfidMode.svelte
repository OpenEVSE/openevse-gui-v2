<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faHourglassHalf, faBolt, faStop} from '@fortawesome/free-solid-svg-icons/index.js'
	export let setmode = (m,c) => {}
	export let mode = 0 // 0: rfid waiting 1: rfid authenticated 2: charging

	let mode1 = "START"
	let mode2 = "STOP"
	let disabled = false
 $: mode, () => {
		if (mode == 0) 
			disabled = true
		else disabled = false
	 }
	
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
		pointer-events: none;
	}
</style>


<div class="mb-2 mt-2 mb-5  is-flex is-flex-wrap-nowrap buttonblock mx-auto buttons field is-grouped">
	<button disabled 
		class="button manual-charge is-size-6 has-tooltip-arrow {mode==0?"is-info":mode==1?"is-primary":"is-danger"}" 
		data-tooltip={mode==0?"Waiting for RFID badge":mode==1?"Start charge session":"Stop charge session"}
		on:click={() => { setmode(mode)}}>
		&nbsp;&nbsp;&nbsp;<Fa icon={mode==1?faBolt:mode==2?faStop:faHourglassHalf} />&nbsp;&nbsp;&nbsp;
	</button>
</div>