<script>
	

	export let value;
	export let min;
	export let max;
	export let step = 1;
	export let label = "";
	export let tooltip = "";
	export let unit = "";
	export let icon = null
	export let onchange = (val) => {};
	export let disabled = false

	let hover = false
	let focus = false

	function togglecolor() {
		hover = !hover
	}
	function togglefocus() {
		focus = !focus
	}
</script>

<style>
	.label {
		position: absolute;
		margin-top: -10px;
	}
	.value {
		width: 5ch;
	}
</style>

<div class="is-flex is-align-items-center is-flex-direction-column">
	{#if label}
	<div class="label has-text-weight-bold mb-0 mr-2 is-flex-shrink-0 has-text-info">{label}</div>
	{/if}
	<div class="is-flex has-text-info is-flex-direction-row my-0 mx-0 py-0">
		{#if icon}
		<iconify-icon class="mt-4 mr-3" icon={icon} style="font-size: 25px"></iconify-icon>

		{/if}
		<div class="" on:mouseenter={togglecolor} on:mouseleave={togglecolor} >			
			<input class="slider is-fullwidth is-medium has-tooltip-arrow {hover||focus?'is-info':''}" 
				data-tooltip={tooltip==""?null:tooltip} 
				step={step?step:1} 
				min={min} max={max} 
				type="range" bind:value={value} on:change={()=>onchange(value)}
				{disabled}
				on:focus={togglefocus} on:blur={togglefocus} />	
		</div>
		<div class="value ml-2 mt-3 tag is-medium has-text-weight-semibold is-info">{value}{unit}</div>
	</div>
</div>