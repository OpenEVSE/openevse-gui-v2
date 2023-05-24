<script>
	import {round} from "../../lib/utils.js"
	export let name = ""
	export let state = false
	export let tooltip = ""
	export let color = "is-info"
	export let icon = null
	export let size = 20
	export let color2 = "is-info"
	export let icon2 = null
	export let size2 = 20
	export let action = () => {}
	export let button = null
	export let breakpoint = "mobile"
	export let visible = true
	export let disabled = false
	let hovered = false
</script>
<style>
	.icon {
		min-width: 80px;
	}
	.name {
		position: relative;
		top: 1px;
	}
</style>

{#if visible}
<div class="mx-1 mb-0 has-text-centered has-text-dark" >
	<button bind:this={button} class="button {state?"":"is-outlined"} has-tooltip has-tooltip-arrow px-2 {state?color:color2} {breakpoint=="mobilemini"?"is-normal":breakpoint=="dekstop"?"is-medium":""}"
	data-tooltip={disabled?null:tooltip} on:click={action} on:mouseenter={()=>hovered = true} on:focus={()=>hovered = true} on:mouseleave={()=>hovered = false} on:blur={()=>hovered = false} {disabled}
	>
		<div class="icon">
			{#if !icon2}
				{#if hovered}
				<iconify-icon icon={icon}  style={"font-size: " + round(size*1.2) + "px;"}></iconify-icon>
				{:else}
				<iconify-icon icon={icon}  style={"font-size: " + size + "px;"}></iconify-icon>
				{/if}
			{:else}
				{#if hovered}
				<iconify-icon icon={state?icon:icon2}  style={"font-size: " + round(size2*1.2) +"px;"}></iconify-icon>
				{:else}
				<iconify-icon icon={state?icon:icon2}  style={"font-size: " + size2 + "px;" }></iconify-icon>
				{/if}
			{/if}
		</div>
	</button>
	{#if name}
	<div class="name has-text-centered has-text-weight-bold is-size-7 is-uppercase">{name}</div>
	{/if}
</div>
{/if}