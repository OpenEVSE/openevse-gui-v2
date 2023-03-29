<script>
	import ButtonIcon from "./ButtonIcon.svelte";
	
	import {round} from "../../lib/utils.js"
	export let name = ""
	export let state = false
	export let tooltip = ""
	export let color = "is-info"
	export let icon = null
	export let size = 20
	export let name2 = ""
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
	.name1 {
		position: relative;
		top: -3px;
		left: -38px;
	}
	.name2 {
		position: relative;
		top: -3px;
		right: -42px;
	}
</style>

{#if visible}
<div class="mx-1 mb-0 has-text-centered has-text-dark" >
	<div class="is-flex is-flex-wrap-nowrap buttonblock buttons field is-grouped has-addons m-0 p-0">
		<ButtonIcon {tooltip} {color} {icon} {size} {breakpoint} {disabled} toggled={state?true:false} {action}
		/>
		<ButtonIcon {tooltip} color={color2} icon={icon2} size={size2} {breakpoint} toggled={state?false:true} {disabled} {action}
		/>
	</div>
	{#if name}
	<div class="m-0 p-0">
		{#if state}
		<div class="m-0 p-0 has-text-centered has-text-weight-bold is-size-7 is-uppercase is-inline-block name1 has-text-dark">
			{name}
		</div>
		{:else}
		<div class="m-0 p-0 has-text-centered has-text-weight-bold is-size-7 is-uppercase is-inline-block name2 has-text-dark">
			{name2}
		</div>
		{/if}
	</div>
	{/if}
</div>
{/if}