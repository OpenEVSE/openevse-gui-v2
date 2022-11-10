<script>
	import Tabs from "./../../ui/Tabs.svelte";
	import AlertBox from "./../../ui/AlertBox.svelte";
	import Switch from "../../ui/Switch.svelte";
	import { config_store } from "../../../lib/stores/config.js";
	import {onMount} from "svelte"
	import InputForm from "../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"

	let auth_checked = false
	let https_checked = false
	let submitState = "default"
	let alert_visible = false
	let usr
	let pwd
	let activetab = 0
	let has_https

	let clickTab = (i) => {
		activetab = i
	}

	let tabs = [
		{name: "Authentication", url:"/configuration/services"},
		{name: "Settings", url:"/configuration/services"}
	]
	
	let submit = async () => {
		submitState = "loading"
		if ( auth_checked && (!usr || !pwd || pwd=='_DUMMY_PASSWORD')) {
			alert_visible = true
			submitState = "default"
			return false
		}
		else {
			const data = {
			www_username: auth_checked?usr:"",
			www_password: auth_checked?pwd:""
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
			auth_checked = true
			return true
		}
			
		else {
			auth_checked = null
			return false
		}	
	}
	

	onMount(() => {
		if ($config_store.http_supported_protocols) {
			$config_store.http_supported_protocols.forEach(p => { 
				if (p === "https") has_https = true
				else has_https = false
			})
		}
	})


	$: getAuthData($config_store.www_username,$config_store.www_password)

</script>
<Box title="HTTP Server">
	<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
	{#if activetab == 0}
	<!-- Authentification -->
	<div class="my-2">
		<Switch name="auth_enabled" label="Enable" tooltip="Enable HTTP authentication with login/password" tooltip_pos="right" bind:checked={auth_checked} />
		<InputForm  title="Username" bind:value={usr} placeholder="Admin" type="text" disabled={!auth_checked} />
		<InputForm title="Password" bind:value={pwd} placeholder="15 characters max" type="password" maxlength=15 disabled={!auth_checked} />
		<Button name="Save" color="is-info" state={submitState} butn_submit={submit} />
	</div>
	{:else if activetab == 1}
	<!-- Settings -->
	<div class="my-2">
		<div class="has-text-weight-semibold">HTTPS</div>
		<Switch name="https_enabled" label="Enable HTTPS" bind:checked={https_checked} disabled={!has_https} />
		{#if !has_https}
		<span class="mx-3 is-size-7 is-italic">HTTPS not supported on current firmware</span>
		{/if}
	</div>
	{/if}
</Box>
<AlertBox title="Error" body="Please set a username & password first" bind:visible={alert_visible}/>