<script>
	export let name;
	export let checked;
	export let label;
	export let tooltip;
</script>
<div class="has-tooltip-arrow has-tooltip is-inline-block" data-tooltip={tooltip}>
	<input id={name} type="checkbox" name={name} class="switch is-outlinedis-info" bind:checked={checked} />
	<label for={name} class="has-text-weight-bold">{label}</label>
</div>