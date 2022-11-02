<script>
	import {onMount} from "svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'

	export let title
	export let value
	export let placeholder
	export let type
	export let onChange = () => {}
	export let status = 0

	let show = false
	let typecss = "text"

	function inputValue(event) {
		value = event.target.value
	}

	function resetStatus(s) {
		if (s==2||s==3) setTimeout(()=> status = 0,2000)
	}


	$: typecss = show ? "text" : "password"
	$: resetStatus(status)
	
	onMount(() => {
		typecss = type
	})

</script>
<style>
	.state {
        float: right;
        margin-right: 10px;
        margin-top: -32px;
        position: relative;
        z-index: 2;
        color: grey;
    }
</style>
<div class="my-2 field">
	<form>
		<span class="has-text-weight-bold">{title}</span>
		<input class="input is-info" type={typecss} placeholder={placeholder} value={value} autocomplete="off"
			on:change={onChange} on:input={inputValue}>
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
		
		<div class="my-2">
			<label class="checkbox">
				<input type="checkbox" bind:checked={show}>
				Show
			</label>
		</div>
		{/if}
	</form>	
</div>

