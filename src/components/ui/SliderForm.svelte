<script>
	export let value;
	export let min;
	export let max;
	export let step;
	export let label;
	export let tooltip;
	export let unit;
	export let onchange = (val) => {};
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

</style>

<div class="is-flex is-align-items-center is-flex-direction-column">
	<div class="is-flex is-flex-direction-row my-0 mx-0 py-0">
		<div class="has-text-weight-bold pt-4 mr-2 is-flex-shrink-0">{label}</div>
		<div class="" on:mouseenter={togglecolor} on:mouseleave={togglecolor} >			
			<input class="slider is-fullwidth is-medium has-tooltip-arrow has-tooltip {hover||focus?'is-info':''}" 
				data-tooltip={tooltip} 
				step={step?step:1} 
				min={min} max={max} 
				type="range" bind:value={value} on:change={()=>onchange(value)}
				on:focus={togglefocus} on:blur={togglefocus} />	
		</div>
		<div class="ml-2 my-3 tag is-medium is-info">{value}{unit}</div>
	</div>
</div>