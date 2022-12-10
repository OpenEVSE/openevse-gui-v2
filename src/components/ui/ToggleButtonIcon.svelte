<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	export let name = ""
	export let state = false
	export let color = "is-info"
	export let tooltip = ""
	export let icon = null
	export let action = () => {}
	export let button
	export let breakpoint = "mobile"
	export let visible = true
</script>

{#if visible}
<div class="mx-1 mb-0 has-text-centered has-text-info" >
	<button bind:this={button} class="button has-tooltip-arrow has-tooltip px-5 {color} {state?"":"is-outlined"} {breakpoint=="mobilemini"?"is-is-normal":breakpoint=="dekstop"?"is-medium":""}"
	data-tooltip={tooltip} on:click={action}
	>
		<div class="icon">
			<Fa icon={icon} size="1.5x" />
		</div>
	</button>
	{#if name}
	<div class="has-text-centered has-text-weight-bold is-size-7">{name}</div>
	{/if}
</div>
{/if}