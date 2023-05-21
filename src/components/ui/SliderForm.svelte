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
	export let color = "has-text-info"

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
	.value {
		width: fit-content;
	}
	.sliderform {
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}
	.label {
		position: relative;
		top: 25px;
	}

</style>

<div class="sliderform is-unselectable" >
	{#if label}
	<div class="label has-text-weight-bold {color}" >{label}</div>
	{/if}
	<div class="is-flex {color} is-flex-direction-row" >
		{#if icon}
		<iconify-icon class="mt-4 mr-3" icon={icon} style="font-size: 25px"></iconify-icon>

		{/if}
		<div class="is-flex-grow-1 is-flex-shrink-1" on:mouseenter={togglecolor} on:mouseleave={togglecolor} >			
			<input class="slider is-fullwidth is-medium has-tooltip-arrow has-tooltip-multiline {hover||focus?'is-info':''}" 
				data-tooltip={tooltip==""?null:tooltip} 
				step={step?step:"1"} 
				min={min} max={max} 
				type="range" bind:value={value} on:change={()=>onchange(value)}
				{disabled}
				on:focus={togglefocus} on:blur={togglefocus} />	
		</div>
		<div
			class="value is-flex-shrink-0 ml-2 mt-3 tag is-medium has-text-weight-semibold is-info" 
			style={"width: " + (max.toString().length + unit.length + 2) + "ch"}
		>
			{value}{unit}
		</div>
	</div>
</div>