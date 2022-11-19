<script>
	export let name
	export let checked
	export let label = null
	export let tooltip = null
	export let tooltip_pos = "top"
	export let hidden = false
	export let disabled = false
	export let is_rtl = false
	export let onChange = () => {}

	let focus = false
	function hoverin() {
		focus = true
	}
	function hoverout() {
		focus = false
		
	}
</script>
<div class="is-flex-shrink-0 mx-2 is-inline-block {tooltip?"has-tooltip-arrow has-tooltip-" + tooltip_pos + " has-tooltip-multiline":""} {hidden?"is-hidden":""}" data-tooltip={tooltip} on:mouseenter={hoverin} on:mouseleave={hoverout}>
	<input type="checkbox" id={name} name={name} class:is-rtl={is_rtl} class="switch is-info {focus == true?'':'is-outlined'}" 
	bind:checked={checked} on:focus={hoverin} on:blur={hoverout} {disabled} on:change={onChange}/>
	<label for={name} class="has-text-weight-bold ">{label?label:""}</label>

</div>