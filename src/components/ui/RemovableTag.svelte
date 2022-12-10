<script>
	import Fa from "svelte-fa/src/fa.svelte";
	import {
		faSpinner,
		faCheck,
		faXmark,} from "@fortawesome/free-solid-svg-icons/index.js";
	import {displayIcon, clientid2name} from "../../lib/utils.js"

	export let action = () => {};
	export let state = ""
	export let client = ""
	export let name = ""
	export let color = "is-info"
	let icon
</script>
<style>
	.item {
		position: absolute;
		overflow:visible;
		top: 45px;;
	}
</style>
<svelte:options accessors />
<div class="{client?"item":""} my-0 my-0 tag {color} has-text-weight-semibold">
	{#if client}
	<Fa
		icon={displayIcon(clientid2name(client))}
		class="has-text-white mr-2 is-capitalized"
	/>
	{clientid2name(client)}
	{:else if name}
	{name}
	{/if}
	{#if state == ""}
		{#if name}
		<button class="button delete is-small" on:click={action} />
		{:else if client && (clientid2name(client) == "manual" || clientid2name(client) == "mqtt")}
		<!-- only display delete button for manual and mqtt claims -->
		<button class="button delete is-small " on:click={action} />
		{/if}
	{:else if state == "loading"}
		<Fa class="ml-1" icon={faSpinner} spin={state == "loading"} />
	{:else if state == "ok"}
		<Fa class="ml-1 has-text-primary" icon={faCheck} />
	{:else}
		<Fa class="ml-1 has-text-danger" icon={faXmark} />
	{/if}
	
</div>
