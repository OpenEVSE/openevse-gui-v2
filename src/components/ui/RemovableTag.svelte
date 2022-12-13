<script>
	import Loader from "./Loader.svelte";
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
		top: 45px;
	}
	.tag {
		border: 0;
		min-width: 30px;
	}
	.spin {
		position: absolute;
		padding-top: -10px;
	}
</style>
<svelte:options accessors />
<div class="tags has-addons my-1 {client?"item":""}" >
	<div class="tag is-flex-grow-1 {color} has-text-weight-semibold ">
		{#if client}
		<Fa
			icon={displayIcon(clientid2name(client))}
			class="has-text-white mr-2 is-capitalized"
		/>
		{clientid2name(client)}
		{:else if name}
		{name}
		{/if}

	</div>
	{#if state == "" && (name || (client && (clientid2name(client) == "manual" || clientid2name(client) == "mqtt") ))}
	<button class="tag is-danger is-clickable" on:click|preventDefault={()=>action()}><Fa icon={faXmark} /></button>
	{:else if state == "loading"}
	<span class="tag is-danger"><Loader width="12" /></span>
	{:else if state == "ok"}
	<span class="tag is-primary"><Fa icon={faCheck} size="1x" /></span>
	{:else if state == "ok"}
	<span class="tag is-danger"><Fa icon={faXmark} size="1x" /></span>
	{/if}
</div>
