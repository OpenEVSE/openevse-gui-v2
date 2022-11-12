<script>
	import {displayTime} from "../../lib/utils.js"
	import {onMount} from "svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faCalendarDays, faHand} from '@fortawesome/free-solid-svg-icons/index.js'
	export let title
	export let state 
	export let time = ""
	export let tz = ""
	let icon

	onMount(
		() => {
			if(time != "") {
				icon = faCalendarDays
			}
			else icon = faHand
		}
	)
</script>

<style>
	.tag-val {
		min-width: 15ch;
	}
	.tag-title {
		min-width: 10ch;
	}
</style>

<div class="column is-narrow px-1 pt-1 pb-0">

	<div class="tags has-addons">
		<span class="tag tag-title is-white has-text-weight-semibold is-size-7"><Fa icon={icon} class="has-text-info mx-2" /> {title}</span>
		<span class="tag tag-val is-capitalized has-text-weight-semibold {state=="active"?"is-primary":"is-danger"}">
			{#if time != ""}
			{state} {displayTime(time,tz)}
			{:else}
			{state}
			{/if}
		</span>
	</div>

</div>