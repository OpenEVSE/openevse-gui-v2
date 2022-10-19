<script>
	export let id;
	export let value;
	export let min;
	export let max;
	export let step;
	export let label;
	export let tooltip;
	export let unit;
	export let onchange = (val) => {};
	let hover = false
	function togglecolor() {
		hover = !hover
	}
</script>
<div>
	<div class="is-inline-block has-text-weight-bold mr-3">{label}</div>
	<div class="is-inline-block" on:focus={togglecolor} on:blur={togglecolor} >>				
		<input id={id} class="slider is-medium pt-5 has-tooltip-arrow has-tooltip {hover?'is-info':''}" 
			data-tooltip={tooltip} 
			step={step?step:1} 
			min={min} max={max} 
			type="range" bind:value={value} on:change={()=>onchange(value)} />
		<span class="ml-3 tag is-medium is-info">{value}{unit}</span>
		
	</div>
</div>