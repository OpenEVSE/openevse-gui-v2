<script>
	import {onMount, onDestroy} from "svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'

	export let title = undefined
	export let value
	export let placeholder
	export let type
	export let maxlength = null
	export let onChange = () => {}
	export let onFocus = () => {}
	export let status = 0
	export let disabled = false
	export let readonly = false

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
        margin-top: -32px;
        position: relative;
        z-index: 2;
    }
</style>
<div class="my-2">
	<form>
		{#if title}
		<span class="has-text-weight-semibold {disabled?"has-text-grey-light":""}">{title}</span>
		{/if}
		<input bind:this={field} {readonly} class="input is-info" type={typecss} placeholder={placeholder} value={value} autocomplete="off" {maxlength}
		{disabled} on:change|preventDefault={onChange} on:focus|preventDefault={onFocus} on:input|preventDefault={inputValue} on:submit|preventDefault >
		<div class="state">
			{#if status==1}
			<Fa class="has-text-info"icon={faSpinner} spin />
			{:else if status==2}
			<Fa class="has-text-primary" icon={faCheck}/>
			{:else if status==3}
			<Fa class="has-text-danger" icon={faXmark}/>
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
	</form>	
</div>

