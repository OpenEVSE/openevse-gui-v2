<script>
	import Loader from "./Loader.svelte";
	
	import {displayIcon, clientid2name} from "../../lib/utils.js"

	export let action = () => {};
	export let state = ""
	export let client = ""
	export let name = ""
	export let color = "is-info"
	export let nobutton = false
	let icon
</script>
<style>
	.item {
		/* position: absolute; */
		overflow:visible;
		/* bottom: -2px; */
		/* left: -8px; */
	}

	.tag.but {
		border:0;
		width: 34px;
	}
	.tag.but:hover {
		background-color: hsl(195, 75%, 22%);
	}
	.tag.name {
		min-width: 80px;
		text-align: center;
		text-overflow: ellipsis;
		/* max-width: 80%; */
	}
	.tagname::first-letter {
  		text-transform: uppercase;
	}

</style>
<svelte:options accessors />
<div class="tags has-addons is-flex is-justify-content-center is-align-items-center {client?"item":""}" >
	<div class="tag name is-flex is-flex-grow-1 is-flex-shrink-0 {color} has-text-weight-semibold m-0" >
		{#if client}
		<iconify-icon class="mr-1" icon={displayIcon(clientid2name(client))}></iconify-icon>
		{clientid2name(client)}
		{:else if name}
		<span class:tagname={client} class="has-text-centered" style="text-overflow: ellipsis;">
			{name}
		</span>
		{/if}

	</div>
	{#if state == "" && !nobutton && (name || (client && ((clientid2name(client) == "manual" )|| clientid2name(client) == "mqtt") ))}
	<button class="tag but is-dark is-clickable m-0 p-2" on:click|preventDefault={()=>action()} >
		<iconify-icon class="" icon={"fa6-solid:xmark"}></iconify-icon>
	</button>
	{:else if state == "loading"}
	<span class="tag but is-dark m-0 p-2"><Loader size="is-size-6" /></span>
	{:else if state == "ok"}
	<span class="tag but is-dark  m-0 p-2"><iconify-icon icon={"fa6-solid:check"}></iconify-icon></span>
	{:else if state == "error"}
	<span class="tag but is-danger  m-0 p-2"><iconify-icon icon={"fa6-solid:xmark"}></iconify-icon></span>
	{/if}
</div>
