<script>
	import { status_store } from "./../../../lib/stores/status.js";
	import InputForm from "./../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import Button from "./../../ui/Button.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import Switch from "./../../ui/Switch.svelte";
	import AlertBox from "../../ui/AlertBox.svelte"

	let stg_submit_state
	let alert_body
	let alert_visible = false


	let stg_submit = async () => {

		stg_submit_state = "loading"
	
		const data = {
			ohm: $config_store.ohm
		}

		if (await config_store.upload(data)) 
			{
				stg_submit_state = "ok"
				return true
			}
		else {
			stg_submit_state = "error"
			return false
		}
	
	}
</script>

<Box title="Vehicle">
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>
