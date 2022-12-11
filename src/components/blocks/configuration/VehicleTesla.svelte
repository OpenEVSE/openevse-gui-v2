<script>
	import Help from "./../../ui/Help.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import Button from "./../../ui/Button.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import InputForm from "./../../ui/InputForm.svelte";
	import AlertBox from "../../ui/AlertBox.svelte"
	import {httpAPI} from "./../../../lib/utils.js"

	let stg_submit_state
	let alert_body
	let alert_visible = false
	let username = ""
	let password = ""
	let mode = 0 // 0: normal , 1: advanced
	let loggedin = false

	const teslaLogin = "https://auth.openevse.com/login"

	let login = async () => {

		stg_submit_state = "loading"

		const data = {
			username: username,
			password: password
		}

		let res = await httpAPI("POST", teslaLogin, data)

		if (await res.ok) {
				const data = {
					tesla_enabled: true,
					tesla_access_token: res.access_token,
					tesla_refresh_token: res.refresh_token,
					tesla_created_at: res.created_at,
					tesla_expires_in: res.expires_in
				}
				//Save auth data
				if (await serialQueue.add(()=>config_store.upload(data))) 
				{
					stg_submit_state = "ok"
					return true
				}
				else {
					stg_submit_state = "error"
					return false
				}
			
			}
		else {
			stg_submit_state = "error"
			return false
		}
	}

	let logout = async () => {
		const data = {
			tesla_enabled: false,
			tesla_access_token: "",
			tesla_refresh_token: "",
			tesla_created_at: "",
			tesla_expires_in: ""
		}
		if (await serialQueue.add(()=>config_store.upload(data))) {
			stg_submit_state = "ok"
			return true
		}
		else {
			stg_submit_state = "error"
			return false
		}
	}

	let stg_submit = async () => {

		stg_submit_state = "loading"

		const data = {
				tesla_enabled: true,
				tesla_access_token: $config_store.tesla_access_token,
				tesla_refresh_token: $config_store.tesla_refresh_token,
				tesla_created_at: Date.now()/1000,
				tesla_expires_in: 3888000
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

	function have_credentials() {
		return  $config_store.tesla_access_token !== false &&
				$config_store.tesla_access_token !== "" &&
				$config_store.tesla_refresh_token !== false &&
				$config_store.tesla_refresh_token !== "" &&
				$config_store.tesla_created_at !== 0 &&
				$config_store.tesla_created_at !== "" &&
				$config_store.tesla_created_at !== false &&
				$config_store.tesla_expires_in !== 0 &&
				$config_store.tesla_expires_in !== "" &&
				$config_store.tesla_expires_in !== false 
	}

	$: $config_store, loggedin = have_credentials()

</script>
<div class="mt-5">
	<h5>Tesla</h5>
	{#if loggedin}
	<div>Fetching vehicle info ...</div>
	<div class="block mt-5">
		<Button name="Logout" color="is-info" state={stg_submit_state} butn_submit={logout} />
	</div>
	{:else if mode == 0}
	<div>
		<InputForm title="Username:" bind:value={username} placeholder="Tesla username" />
		<InputForm title="Password:" bind:value={password} type="password" placeholder="Tesla password" />
		<div class="block mt-5">
			<Button name="Login" color="is-info" state={stg_submit_state} butn_submit={login} />
			<Button name="Advanced" color="is-info" butn_submit={()=>mode=1} />
		</div>
	</div>
	{:else if mode == 1}
	<div>
		<InputForm title="Access Token:" bind:value={$config_store.tesla_access_token} type="password" placeholder="" />
		<InputForm title="Refresh Token:" bind:value={$config_store.tesla_refresh_token} type="password" placeholder="" />
		<div class="block mt-5">
			<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
			<Button name="Normal" color="is-info" butn_submit={()=>mode=0} />
		</div>
	</div>
	{/if}
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</div>