<script>
export let checked = false
export let label = null
export let tooltip = null
export let onChange = () => {}
export let disabled = false
export let small = false
export let color = "info"
export let bold = false

let focus = false;
function togglefocus() {
		focus = !focus
	}
</script>
<style>
</style>

<div class="is-flex is-flex-direction-column is-align-items-center">
	<div class="control-label is-capitalized has-text-{color} mb-0 {small?"is-size-7":"is-size-6"} {bold?"has-text-weight-bold":"has-text-weight-normal"}" class:is-hidden={!label}>{label}</div>
	<div class="is-inline-block">
		<label class="b-checkbox checkbox m-0 p-0" class:is-small={small}>
			<input 
				type="checkbox" class="checkbox" 
				bind:checked={checked}
				on:focus={togglefocus} on:blur={togglefocus}
				on:change={onChange}
				{disabled}
			>
			<span 
				class="check is-{color} has-tooltip has-tooltip-arrow has-tooltip-multiline" 
				data-tooltip={tooltip} >
			</span>
			
		</label>
	</div>
	
	
</div>