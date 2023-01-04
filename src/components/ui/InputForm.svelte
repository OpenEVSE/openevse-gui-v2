<script>
	import Loader from "./Loader.svelte";
	import {onMount, onDestroy} from "svelte"
	

	export let title = undefined
	export let value
	export let placeholder = ""
	export let type = "text"
	export let maxlength = null
	export let onChange = () => {}
	export let onFocus = () => {}
	export let status = 0
	export let disabled = false
	export let readonly = false
	export let is_inline = false


	let show = false
	let typecss = "text"
	let field
	let timeout
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
		if (s==2||s==3) timeout = setTimeout(()=> status = 0,2000)
	}

	

	$: typecss = show ? "text" : "password"
	$: resetStatus(status)



</script>

<style>
	.state {
        float: right;
        margin-right: 10px;
        margin-top: -33px;
        position: relative;
        z-index: 2;
    }
	.state-num {
        float: right;
        margin-right: 40px;
        margin-top: -33px;
        position: relative;
        z-index: 2;
    }
</style>
<div class="my-2 {is_inline?"is-inline-block":""}">
		{#if title}
		<span class="has-text-weight-semibold {disabled?"has-text-grey-light":""}">{title}</span>
		{/if}
		<input bind:this={field} {readonly} class="input is-info" type={typecss} placeholder={placeholder} value={value} autocomplete="off" {maxlength}
		{disabled} on:change|preventDefault={onChange} on:focus={onFocus} on:input={inputValue}	>
		<div class="is-size-5 {type == "number"?"state-num":"state"}">
			{#if status==1}
			<Loader  color="has-text-info"/>
			{:else if status==2}
			<iconify-icon class="has-text-primary" icon="fa6-solid:check"></iconify-icon>
			{:else if status==3}
			<iconify-icon class="has-text-primary" icon="fa6-solid:xmark"></iconify-icon>
			{/if}
		</div>
		{#if type=="password"}	
		<div class="my-2 {disabled?"has-text-grey-light":""}">
			<label class="checkbox">
				<input type="checkbox" bind:checked={show} {disabled}>
				Show
			</label>
		</div>
		{/if}
</div>

