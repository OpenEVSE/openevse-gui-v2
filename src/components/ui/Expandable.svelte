<script>
	import MonitoringItem from "./MonitoringItem.svelte";
	import { createEventDispatcher } from 'svelte';
	import { slide } from "svelte/transition";	
	export let data
	export let expanded = false

	const dispatch = createEventDispatcher();

	function closeAll() {
		dispatch('message', {
			text: 'closeAll'
		});
	}


	let expand = () => {
		closeAll()
		expanded = !expanded
	}



</script>
<style>
	.header {
		width: 100%;
	}
	.arrow {
		position: absolute;
		right: 15px;
		margin-top: 3px;
		
	}
</style>
<div class="mb-1">
	<a href={null} on:click={expand} class="" aria-label="display">
		<div class="header has-background-info has-text-white py-1"	>
			<span class="ml-2 has-text-white has-text-weight-bold">{data.title}</span>
			<iconify-icon class="arrow mx-2" inline icon={expanded?"fa6-solid:angle-up":"fa6-solid:angle-down"}></iconify-icon>	
		</div>
	</a>
	{#if expanded}
	<div class="is-collapsible" transition:slide|local={{ duration: 300 }}>
		{#each data.items as item, i}
			{#if item.value != undefined}
			<MonitoringItem name={item.name} value={item.value} unit={item.unit!=undefined?item.unit:""} />
				{#if i < data.items.length - 1}
				<hr class="m-0 p-0"/>
				{/if}
			{/if}
		{/each}
	</div>
	 {/if}
</div>