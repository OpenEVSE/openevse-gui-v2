<script>
	import Loader from "./Loader.svelte";
	import {onDestroy} from "svelte"

	export let value
	export let title = ""
	export let status = ""
	export let disabled = false
	export let items = [] // [{name: "name", value: "value"}, ...]
	export let onChange = () => {}
	export const setStatus = (val) => {status = val}
	let timeout

	function resetStatus(s) {
		if (s=="ok"||s=="error") {
			if (!timeout)
				timeout = setTimeout(()=> {
					status = ""
					timeout = null
				},2000)
		}
		
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
	.main {
		position: relative;
	}
	.state {
        position: absolute;
		opacity: 1;
		top: -34px;
		right: 6px;
        z-index: 4;
		border-radius: 50%;
		display: inline-block;
		width: 28px;
		height: 28px;
		border: 1px none rgb(50, 179, 212);
    }
</style>

{#if title}
<div class="has-text-weight-bold mt-2">{title}</div>
{/if}
<div class="is-inline-block mb-2">
	<div class="select is-info">
		<select bind:value={value} on:change={onChange} {disabled}>
			{#each items as item }
			<option value={item.value}>{item.name}</option>
			{/each}
		</select>
	</div>
	<div class="main ">
		<span class="is-size-5 state has-background-white is-flex is-align-items-center is-justify-content-center" class:is-hidden={!status}>
			{#key status}
				{#if status=="loading"}
				<Loader color="has-text-info"/>
				{:else if status=="ok"}
				<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
				{:else if status=="error"}
				<iconify-icon class="has-text-primary" icon="fa6-solid:xmark"></iconify-icon>
				{/if}
			{/key}
		</span>
	</div>
</div>