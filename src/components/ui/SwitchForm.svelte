<script>
	export let name
	export let checked
	export let label
	export let tooltip
	export let hidden = false

	let focus = false
	let hover = false
	function togglefocus() {
		focus = !focus
	}
	function togglehover() {
		hover = !hover
	}
</script>
<div class="is-flex-shrink-0 mr-4 has-tooltip-arrow has-tooltip-top has-tooltip-multiline is-inline-block {hidden?"is-hidden":""}" data-tooltip={tooltip} on:mouseenter={togglehover} on:mouseleave={togglehover}>
	<input id={name} type="checkbox" name={name} class="switch is-info {focus||hover == true?'':'is-outlined'}" 
	bind:checked={checked} on:focus={togglefocus} on:blur={togglefocus} />
	<label for={name} class="has-text-weight-bold">{label}</label>
</div>