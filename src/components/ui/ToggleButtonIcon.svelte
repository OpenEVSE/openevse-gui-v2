<script>
	import 'iconify-icon';
	export let name = ""
	export let state = false
	export let color = "is-info"
	export let tooltip = ""
	export let icon = null
	export let action = () => {}
	export let button
	export let breakpoint = "mobile"
	export let visible = true
	export let disabled = false
	let hovered = false
</script>
<style>
	.icon {
		min-width: 80px;
	}
</style>

{#if visible}
<div class="mx-1 mb-0 has-text-centered has-text-info" >
	<button bind:this={button} class="button {state?"":"is-outlined"}  has-tooltip-arrow has-tooltip px-5 {color} {breakpoint=="mobilemini"?"is-normal":breakpoint=="dekstop"?"is-medium":""}"
	data-tooltip={tooltip} on:click={action} on:mouseenter={()=>hovered = true} on:focus={()=>hovered = true} on:mouseleave={()=>hovered = false} on:blur={()=>hovered = false} {disabled}
	>
		<div class="icon">
			<iconify-icon icon={icon} class="{hovered?"is-size-4":"is-size-5"}"></iconify-icon>
			
		</div>
	</button>
	{#if name}
	<div class="has-text-centered has-text-weight-bold is-size-7">{name}</div>
	{/if}
</div>
{/if}