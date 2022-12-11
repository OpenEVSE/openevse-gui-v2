<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'
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
	<div class="is-inline-block mx-2 my-2">
		{#if status=="loading"}
		<Fa class="has-text-info"icon={faSpinner} spin />
		{:else if status=="ok"}
		<Fa class="has-text-primary" icon={faCheck}/>
		{:else if status=="error"}
		<Fa class="has-text-danger" icon={faXmark}/>
		{/if}
	</div>
</div>