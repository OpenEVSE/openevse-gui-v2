<script>
	import Loader from "./Loader.svelte";
	
	import {onDestroy} from "svelte"

	export let value
	export let title = ""
	export let status = ""
	export let disabled = false
	export let items = [] // [{name: "name", value: "value"}, ...]
	export let onChange = () => {}
	let timeout

	function resetStatus(s) {
		if (s=="ok"||s=="error") timeout = setTimeout(()=> status = "",2000)
	}

	onDestroy(() => {
		clearTimeout(timeout)
	})

	$: resetStatus(status)

</script>
<style>
	.select {
		max-width: 250px;;
	}
</style>

<div class="is-inline-block my-2">
	{#if title}
	<div class="has-text-weight-bold">{title}</div>
	{/if}
	<div class="select is-info">
		<select bind:value={value} on:change={onChange} {disabled}>
			{#each items as item }
			<option value={item.value}>{item.name}</option>
			{/each}
		</select>
	</div>
	<div class="is-inline-block mx-2 my-2 is-size-5">
		{#if status=="loading"}
		<Loader color="has-text-info" />
		{:else if status=="ok"}
		<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
		{:else if status=="error"}
		<iconify-icon class="has-text-danger" icon="fa6-solid:xmark"></iconify-icon>
		{/if}
	</div>
</div>