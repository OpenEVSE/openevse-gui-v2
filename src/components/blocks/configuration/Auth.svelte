<script>
	import AlertBox from "./../../ui/AlertBox.svelte";
	import Switch from "../../ui/Switch.svelte";
	import { config_store } from "../../../lib/stores/config.js";
	import InputForm from "../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"

	let checked = false
	let submitState = "default"
	let alert_visible = false
	let usr
	let pwd

	let submit = async () => {
		console.log("save user/pass")
		submitState = "loading"
		if ( checked && (!usr || !pwd || pwd=='_DUMMY_PASSWORD')) {
			alert_visible = true
			submitState = "default"
			return false
		}
		else {
			const data = {
			www_username: checked?usr:"",
			www_password: checked?pwd:""
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

	let getAuthData = (u,p) => {
		console.log("getAuthData user: " + u + "pwd: " + p)
		usr = u
		pwd = p

		if (u || p)  {
			checked = true
			return true
		}
			
		else {
			checked = null
			return false
		}	
	}
		
	$: getAuthData($config_store.www_username,$config_store.www_password)

</script>
<Box title="Authentification">
	<Switch name="auth_enabled" label="Enable" tooltip="Enable authenfication for Web Interface & HTTP API " tooltip_pos="right" bind:checked />
	<InputForm title="Username" bind:value={usr} placeholder="Admin" type="text" disabled={!checked} />
	<InputForm title="Password" bind:value={pwd} placeholder="15 characters max" type="password" maxlength=15 disabled={!checked} />
	<Button name="Save" color="is-info" state={submitState} butn_submit={submit} />
	
</Box>
<AlertBox title="Error" body="Please set a username & password first" bind:visible={alert_visible}/>