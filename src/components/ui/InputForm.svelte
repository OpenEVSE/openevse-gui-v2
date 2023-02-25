<script>
	import Checkbox from "./Checkbox.svelte";
	import { _ } 		    	from 'svelte-i18n'
	import Loader 				from "./Loader.svelte";
	import {onMount, onDestroy} from "svelte"
	

	export let title = undefined
	export let value
	export let status = ""
	export let placeholder = ""
	export let type = "text"
	export let maxlength = null
	export let min = null // for type "number"
	export let max = null // for type "number"
	export let step = null
	export let disabled = false
	export let readonly = false
	export let is_inline = false
	export let size = null
	export let onChange = () => {}
	export let onFocus = () => {}
	export const setStatus = (val) => {
		status = val
	}
	export const setValue = (val) => {
		value = val
	}

	let show = false
	let typecss = "text"
	let timeout
	const hiddenpass = "••••••••••"

	onMount(() => {
		typecss = type
	})

	onDestroy(() => {
		clearTimeout(timeout)
	})

	function inputValue(event) {
		event.preventDefault()
		value = event.target.value
	}

	function resetStatus(s) {
		if (s=="ok"||s=="error") timeout = setTimeout(()=> status = "",2000)
	}

	

	$: typecss = show ? "text" : "password"
	$: resetStatus(status)



</script>

<style>

	.main {
		position: relative;
	}
	.state {
        position: absolute;
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
<div class="mb-2 mx-1 has-text-left {is_inline?"is-inline-block":""}">
		{#if title}
		<div class="has-text-weight-semibold has-text-centered  {disabled?"has-text-grey-light":"has-text-dark"}">{title}</div>
		{/if}
		<input {readonly} {step} class="input is-info" type={typecss} placeholder={placeholder} value={value!=undefined?value:""} {maxlength} min={min} max={max}
		{disabled} on:change|preventDefault={onChange} on:focus={onFocus} on:input={inputValue}	style={size?"width: " + size + "ch;":null}>
		<div class="main ">
			<span class="is-size-5 state has-background-white is-flex is-align-items-center is-justify-content-center" class:is-hidden={!status}>
				{#if status=="loading"}
				<Loader color="has-text-info"/>
				{:else if status=="ok"}
				<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
				{:else if status=="error"}
				<iconify-icon class="has-text-primary" icon="fa6-solid:xmark"></iconify-icon>
				{/if}
			</span>
		</div>	
		{#if type=="password" && value != hiddenpass}
		<div class="mt-1 mx-2 is-flex is-flex-direction-row is-justify-content-start {disabled?"has-text-grey-light":""}">
			<Checkbox bind:checked={show} {disabled} small  />
			<span class="ml-2 has-text-info">{$_("show")}</span>
		</div>
		{/if}
</div>

