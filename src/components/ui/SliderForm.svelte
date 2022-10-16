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
</script>
<div>
	<span class="mt-3 has-text-weight-bold">{label}</span>
	<span>				
		<input id={id} class="slider is-medium pt-5 has-tooltip-arrow has-tooltip" data-tooltip={tooltip} step={step?step:1} min={min} max={max} type="range" bind:value={value} on:change={()=>onchange(value)} />
		<span class="ml-3 tag is-medium is-info">{value}{unit}</span>
		
	</span>
</div>