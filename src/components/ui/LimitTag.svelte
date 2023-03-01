<script>
	import { _ } 	from 'svelte-i18n'
	import Loader 	from "./Loader.svelte";
	import {sec2time, round} from "../../lib/utils.js"
	export let icon
	export let type
	export let types = {}
	export let value
	export let left
	export let unit
	export let auto_release = true
	export let onClick = () => {}
	export let state = ""
	export let is_admin = false

	let displayValue = (val) => {
		switch (type) {
			case 'time':
				if (val>0) {	
					let ret = sec2time(val*60)
					return ret
				}
				else return "0mn"
			case 'energy':
				return Math.round(val/1000)
				
			default:
				return val
		}
	}

</script>
<style>
	.tag.but {
		position: relative;
		border:0px;
		top:-4px;
		right: 1px;
		width: 34px;
	}
	.tag.but:hover {
		background-color: hsl(195, 75%, 22%);
	}
	.countdown {
		position: relative;
		bottom: 15px;
	}
</style>

<div class="m-0 p-0">
	<div class="tags has-addons is-flex is-justify-content-center">
		<div class="tag is-medium is-info has-text-weight-bold is-capitalized">
			<iconify-icon inline class="has-text-white" icon={icon}></iconify-icon>
			<span class="ml-2">{types[type].name}</span>		
		</div>
		<span class="tag is-medium val has-text-weight-bold is-info">
			{displayValue(value)}{unit}
		</span>
		{#if auto_release || (is_admin && !auto_release)}
			{#if state == ""}
			<button class="tag is-medium but is-dark is-clickable m-0 p-0" on:click={onClick}>
				<iconify-icon icon={"fa6-solid:xmark"}></iconify-icon>
			</button>
			{:else if state == "loading"}
			<span class="tag is-medium but is-dark m-0 p-2"><Loader size="is-size-6" /></span>
			{:else if state == "ok"}
			<span class="tag is-medium but is-dark  m-0 p-2"><iconify-icon icon={"fa6-solid:check"}></iconify-icon></span>
			{:else if state == "error"}
			<span class="tag is-medium but is-danger  m-0 p-2"><iconify-icon icon={"fa6-solid:xmark"}></iconify-icon></span>
			{/if}
		{:else}
			<span class="tag is-medium is-dark m-O p-2">
				<iconify-icon inline icon={"material-symbols:lock"} height={18}></iconify-icon>
			</span>
		{/if}
	</div>
	{#if !is_admin}
	<div class="countdown m-0 p-0 has-text-info has-text-weight-bold">
		{$_("limits.left")}: {left}{unit} 
	</div>
	{/if}
</div>