<script>
	import Box from "../../ui/Box.svelte"
	import ButtonFetch from "../../ui/ButtonFetch.svelte"
	export let is_opened = false
</script>

<div class="modal" class:is-active={is_opened}>
	<div class="modal-background"></div>
	<div class="modal-content p-3">
		<Box title="WiFi module Firmware Update">
			<ButtonFetch name="Close" butn_submit={()=>is_opened=false} />
		</Box>
	</div>
</div>
