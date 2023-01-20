<script>
export let checked = false
export const setValue = (val) => checked = val

let focus = false;
function togglefocus() {
		focus = !focus
	}
</script>
<style>
</style>
<div class="mt-2">
	<label class="checkradio has-text-weight-semibold focus-no-outline">
		<input type="checkbox" class="has-tooltip-arrow has-tooltip-right {focus?'is-info':''}" 
		data-tooltip="Release manual override when vehicle is disconnected" bind:checked={checked}
		on:focus={togglefocus} on:blur={togglefocus} >
		Auto-release
	</label>
</div>