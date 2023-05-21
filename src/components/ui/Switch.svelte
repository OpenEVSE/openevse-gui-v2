<script>
	import { onDestroy } 	from "svelte";
	import Loader 			from "./Loader.svelte"

	export let name
	export let checked
	export let label = null
	export let tooltip = null
	export let tooltip_pos = "top"
	export let hidden = false
	export let disabled = false
	export let is_rtl = false
	export let onChange = () => {}
	export let status = ""
	export let loader = false
	export const setStatus = (val) => { status = val}
	export const setValue = (val) => checked = val

	let timeout
	let focus = false
	function hoverin() {
		focus = true
	}
	function hoverout() {
		focus = false
		
	}

	function resetStatus(s) {
		if (s=="ok"||s=="error") status = ""
	}

	onDestroy(() => {
		clearTimeout(timeout)
	})

	$: resetStatus(status)

</script>

<style>
	/* .switch {
		position: relative;
	} */

	.loadr {
		position: absolute;
		top: 8px;
		left: -8px;
	}
	.main {
		position: relative;
	}
	.state {
        position: absolute;
		opacity: 1;
		top: 8px;
		left: 0px;
        z-index: 4;
		display: inline-block;
		width: 50px;
		height: 24px;
		border: 1px none rgb(50, 179, 212);
		background: white;
		border-radius: 5px;
		border: 1px solid rgb(50, 179, 212);

    }
</style>
<svelte:options accessors/>
<div class="switch is-flex-shrink-0 is-inline-block {tooltip?"has-tooltip-arrow has-tooltip-" + tooltip_pos + " has-tooltip-multiline":""} {hidden?"is-hidden":""}" data-tooltip={tooltip} on:mouseenter={hoverin} on:mouseleave={hoverout}>
	{#if loader}
	<div class="main" class:is-hidden={status==""?true:false}>
		<span class="is-size-5 state has-background-white is-flex is-align-items-center is-justify-content-center">
			{#if status=="loading"}
			<Loader color="has-text-info" />
			{:else if status=="ok"}
			<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
			{:else if status=="error"}
			<iconify-icon class="has-text-danger" icon="fa6-solid:xmark"></iconify-icon>
			{/if}
		</span>
	</div>
	{/if}
	<input type="checkbox" id={name} name={name} class:is-rtl={is_rtl} class="switch is-dark {focus == true?'':'is-outlined'}" 
	bind:checked={checked} on:focus={hoverin} on:blur={hoverout} {disabled} on:change={onChange}/>
	<label for={name} class="has-text-dark has-text-weight-bold has-text-left">{label?label:""}</label>
	
</div>