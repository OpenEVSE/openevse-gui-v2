<script>
	import { link, location} from "svelte-spa-router"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faCheck, faXmark, faSpinner} from '@fortawesome/free-solid-svg-icons/index.js'
	export let color = "has-text-white"
	export let state = ""
	export let butn_submit = () => {}
	export let tooltip = null
	export let icon
	export let disabled = false
	export let size = ""

	function changeState(state) {
		if (state) disabled = true
		else disabled = false
	}

	$: changeState(state)

</script>
<style>
	.loading {
    pointer-events:none;
}
</style>

<a href={$location} use:link
class="m-0 p-0 has-tooltip-arrow has-tooltip {state=="ok"?"has-text-primary":state=="error"?"has-text-danger":state=="loading"?"has-text-info":color} {disabled?"loading":""}"
on:click|preventDefault={butn_submit} data-tooltip={tooltip}>



{#if state == "ok"}
	<Fa icon={faCheck} {size}/>
{:else if state == "error"}
	<Fa icon={faXmark} {size}/>
{:else if state == "loading"}
	<Fa icon={faSpinner} {size} spin/>
{:else}
	<Fa icon={icon} {size}/>
{/if}
</a>