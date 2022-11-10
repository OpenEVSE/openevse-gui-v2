<script>
	export let name
	export let checked
	export let label
	export let tooltip
	export let tooltip_pos = "top"
	export let hidden = false

	let focus = false
	function hoverin() {
		focus = true
	}
	function hoverout() {
		focus = false
		
	}
</script>
<div class="is-flex-shrink-0 mx-3 {tooltip?"has-tooltip-arrow has-tooltip-" + tooltip_pos + " has-tooltip-multiline":""} is-inline-block {hidden?"is-hidden":""}" data-tooltip={tooltip} on:mouseenter={hoverin} on:mouseleave={hoverout}>
	<input id={name} type="checkbox" name={name} class="switch is-info {focus == true?'':'is-outlined'}" 
	bind:checked={checked} on:focus={hoverin} on:blur={hoverout} />
	<label for={name} class="has-text-weight-bold">{label}</label>
</div>