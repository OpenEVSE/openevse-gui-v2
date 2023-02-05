<script>
export let checked = false
export let label
export let tooltip = ""
export let onChange = () => {}

let focus = false;
function togglefocus() {
		focus = !focus
	}
</script>
<style>
</style>

<div class="">
	<div class="control-label is-capitalized has-text-info has-text-weight-semibold">{label}</div>
	<div class=" is-inline-block">
		<label class="b-checkbox checkbox m-0 p-0">
			<input 
				type="checkbox" class="checkbox" 
				bind:checked={checked}
				on:focus={togglefocus} on:blur={togglefocus}
				on:change={onChange}
			>
			<span 
				class="check is-info has-tooltip has-tooltip-arrow" 
				data-tooltip={tooltip} >
			</span>
			
		</label>
	</div>
	
	
</div>