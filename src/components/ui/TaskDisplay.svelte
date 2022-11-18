<script>
	import {displayTime} from "../../lib/utils.js"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faHand, faRobot} from '@fortawesome/free-solid-svg-icons/index.js'
	export let state 
	export let time = ""
	export let mode
	export let msg = ""

	let icon

	function displayIcon(mode) {
		switch (mode) {
			case "manual":
				return faHand
			default:
				return faRobot
		}
	}


	
</script>

<div class="tags has-addons m-0 mr-2">
	<span class="tag is-info is-flex-grow-0 has-text-weight-semibold is-size-7 is-capitalized"><Fa icon={displayIcon(mode)} class="has-text-white" />&nbsp; {mode}</span>
	<span class="tag is-flex-grow-1 is-flex-shrink-1 is-capitalized has-text-weight-semibold {state=="active"?"is-primary":"is-danger"}">
		{#if time != ""}
		{msg} {displayTime(time)}
		{:else}
		{state}
			{#if msg}
			&nbsp;{msg}
			{/if}
		{/if}
	</span>
</div>
