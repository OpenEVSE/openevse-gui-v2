<script>
export let checked = false
export let label

let focus = false;
function togglefocus() {
		focus = !focus
	}
</script>

<div class="mt-2">
	<label class="b-checkbox checkbox focus-no-outline is-normal is-size-6">
		<input type="checkbox" class="checkbox has-tooltip-arrow has-tooltip-right {focus?'is-info':''}" 
		data-tooltip="Release manual override when vehicle is disconnected" bind:checked={checked}
		on:focus={togglefocus} on:blur={togglefocus} >
		<span class="check is-info"></span>
		<span class="control-label">{label}</span>
	</label>
</div>

<!-- <div class="field">
	<label class="b-checkbox checkbox">
	  <input type="checkbox" value="false" checked>
	  <span class="check"></span>
	  <span class="control-label">Basic</span>
	</label>
  </div> -->