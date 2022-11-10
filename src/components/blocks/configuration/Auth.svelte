<script>
	import AlertBox from "./../../ui/AlertBox.svelte";
	import SwitchForm from "../../ui/SwitchForm.svelte";
	import { config_store } from "../../../lib/stores/config.js";
	import InputForm from "../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"

	let checked = false
	let submitState = "default"
	let alert_visible = false

	let submit = async () => {
		console.log("save user/pass")
		submitState = "loading"
		if (!$config_store.www_username || !$config_store.www_password || $config_store.www_password=='_DUMMY_PASSWORD' ) {
			alert_visible = true
			return false
		}
		else {
			const data = {
			www_username: $config_store.www_username,
			www_password: $config_store.www_password
			}
			if (await config_store.upload(data)) 
				{
					submitState = "ok"
					return true
				}
			else {
				submitState = "error"
				return false
			}
		}
	}
		
	// $: $config_store.www_username, () => {
	// 		if ($config_store.www_username) 
	// 			enabled = true
	// 		else
	// 			enabled = false
	// 	}

</script>
<Box title="Authentification">
	<SwitchForm name="auth_enabled" label="Enable" tooltip="Enable authenfication for Web Interface & HTTP API " tooltip_pos="right" {checked} />
	<InputForm title="Username" bind:value={$config_store.www_username} placeholder="Admin" type="text"  />
	<InputForm title="Password" bind:value={$config_store.www_password} placeholder="15 characters max" type="password" maxlength=15  />
	<Button name="Save" color="is-info" state={submitState} butn_submit={submit} />
	
</Box>
<AlertBox title="Error" body="Please set a username & password first" visible={alert_visible}/>