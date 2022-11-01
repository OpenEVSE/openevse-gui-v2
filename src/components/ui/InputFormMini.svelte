<script>
	import {onMount} from "svelte"
	export let title
	export let value
	export let placeholder
	export let type
	export let onChange = () => {}
	let show = false
	let ispwd = false
	let typecss = "text"
	function inputValue(event) {
		value = event.target.value
	}

	$: typecss = show ? "text" : "password"

	onMount(() => {
		typecss = type
	})
</script>
<style>
	.field {
			/* max-width: 300px; */
		}
</style>
<div class="my-2 field">
	<form>
		<span class="has-text-weight-bold">{title}</span>
		<input class="input is-info" type={typecss} placeholder={placeholder} value={value} autocomplete="off"
			on:change={onChange} on:input={inputValue}>
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