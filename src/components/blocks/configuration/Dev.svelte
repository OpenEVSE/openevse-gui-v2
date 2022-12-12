<script>
	import Button from "./../../ui/Button.svelte";
	import Box from "./../../ui/Box.svelte";

	function openConsole(cons) {
		let url
		if (cons=="debug")
			url = "/term.html?debug"
		else if (cons=="openevse")
			url = "/term.html?evse"
		if (import.meta.env.DEV) {
			url = "/api" + url
		}
		window.open(url, '_blank')
	}

</script>

<Box title="Developer" icon="mdi:console">
	<div class="mt-4">
		<Button name="Debug" color="is-info" butn_submit={()=>openConsole("debug")} />
		<Button name="OpenEVSE" color="is-info" butn_submit={()=>openConsole("openevse")} />
	</div>
</Box>