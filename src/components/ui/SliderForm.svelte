<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	export let value;
	export let min;
	export let max;
	export let step;
	export let label = "";
	export let tooltip;
	export let unit;
	export let icon = null
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
	<div class="is-flex has-text-info is-flex-direction-row my-0 mx-0 py-0">
		{#if icon}
		<Fa class="mt-4 mr-3" size="1.6x" icon={icon} />
		{:else}
		<div class="has-text-weight-bold pt-4 mr-2 is-flex-shrink-0">{label}</div>
		{/if}
		<div class="" on:mouseenter={togglecolor} on:mouseleave={togglecolor} >			
			<input class="slider is-fullwidth is-medium has-tooltip-arrow has-tooltip {hover||focus?'is-info':''}" 
				data-tooltip={tooltip} 
				step={step?step:1} 
				min={min} max={max} 
				type="range" bind:value={value} on:change={()=>onchange(value)}
				on:focus={togglefocus} on:blur={togglefocus} />	
		</div>
		<div class="ml-2 mt-3 tag is-medium is-info">{value}{unit}</div>
	</div>
</div>