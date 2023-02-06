<script>
	import Loader from "./Loader.svelte";
	import {onDestroy} from "svelte"

	export let value
	export let title = ""
	export let status = ""
	export let disabled = false
	export let items = [] // [{name: "name", value: "value", disabled: "true" (optionnal)}, ...] or ["value", "value", ...]
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

<div class="is-inline-block">
	{#if title}
	<div class="has-text-weight-bold has-text-dark">{title}</div>
	{/if}
	<div class="is-inline-block mb-2 mx-1">
		<div class="select is-info">
			<select bind:value={value} on:change={onChange} {disabled} size=1>
				{#each items as item }
				<option value={item.value!=undefined?item.value:item} selected={item.disabled} disabled={item.disabled}>{item.name!=undefined?item.name:item}</option>
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
					<iconify-icon class="has-text-danger" icon="fa6-solid:xmark"></iconify-icon>
					{/if}
				{/key}
			</span>
		</div>
	</div>
</div>
