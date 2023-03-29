<script>
	import {round} from "../../lib/utils.js"
	export let tooltip = ""
	export let color = "is-info"
	export let icon = null
	export let size = 20
	export let action = () => {}
	export let button = null
	export let breakpoint = "mobile"
	export let disabled = false
	export let toggled = false
	let hovered = false
</script>
<style>
	.icon {
		min-width: 80px;
	}
	.no-pointer {
		cursor: default;
		pointer-events: none;
	}
</style>

<button bind:this={button} 
	class="m-0 button has-tooltip-arrow has-tooltip px-2
	{toggled?"is-active no-pointer":"is-outlined"} 
	{color}"
	data-tooltip={tooltip} 
	on:click={action} 
	on:mouseenter={()=>hovered = true} 
	on:focus={()=>hovered = true} 
	on:mouseleave={()=>hovered = false} 
	on:blur={()=>hovered = false} {disabled}
>
	<div class="icon">
		{#if hovered}
		<iconify-icon icon={icon}  style={"font-size: " + round(size*1.2) + "px;"}></iconify-icon>
		{:else}
		<iconify-icon icon={icon}  style={"font-size: " + size + "px;"}></iconify-icon>
		{/if}
	</div>
</button>