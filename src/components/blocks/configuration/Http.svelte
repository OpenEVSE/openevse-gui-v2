<script>
	import Tabs from "./../../ui/Tabs.svelte";
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
	let activetab = 0

	let clickTab = (i) => {
		activetab = i
	}

	let tabs = [
		{name: "Authentication", url:"/configuration/services"},
		{name: "Settings", url:"/configuration/services"}
	]
	
	let submit = async () => {
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
<Box title="HTTP Server">
	<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
	{#if activetab == 0}
	<!-- Authentification -->
	<div class="my-2">
		<Switch name="auth_enabled" label="Enable" tooltip="Enable HTTP authentication with login/password" tooltip_pos="right" bind:checked />
		<InputForm  title="Username" bind:value={usr} placeholder="Admin" type="text" disabled={!checked} />
		<InputForm title="Password" bind:value={pwd} placeholder="15 characters max" type="password" maxlength=15 disabled={!checked} />
		<Button name="Save" color="is-info" state={submitState} butn_submit={submit} />
	</div>
	{:else if activetab == 1}
	<!-- Settings -->

	{/if}
</Box>
<AlertBox title="Error" body="Please set a username & password first" bind:visible={alert_visible}/>