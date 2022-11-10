<script>
	import { config_store } from "../../../lib/stores/config.js";
	import InputForm from "../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"

	let submitState = "default"

	let submit = async () => {
		console.log("save user/pass")
		submitState = "loading"
		const data = {
			www_username: $config_store.www_username,
			www_password: $config_store.www_password
		}
		if (await config_store.upload(data)) 
				{
					submitState = "ok"
				}
			else {
				submitState = "error"
			}
	}
	



</script>
<Box title="Authentification">
	<InputForm title="Username" bind:value={$config_store.www_username} placeholder="Admin" type="text"  />
	<InputForm title="Password" bind:value={$config_store.www_password} placeholder="15 characters max" type="password" maxlength=15  />
	<Button name="Save" color="is-info" state={submitState} butn_submit={submit} />
</Box>