<script>
	import { _ } 		    from 'svelte-i18n'
	import { tesla_store }  from "./../../../lib/stores/tesla.js";
	import { onMount } 		from "svelte";
	import { serialQueue } 	from "./../../../lib/queue.js";
	import { config_store } from "./../../../lib/stores/config.js";
	import {httpAPI} 		from "./../../../lib/utils.js"
	import Select 			from "./../../ui/Select.svelte";
	import Button 			from "./../../ui/Button.svelte";
	import InputForm 		from "./../../ui/InputForm.svelte";
	import AlertBox 		from "../../ui/AlertBox.svelte"


	let stg_submit_state
	let alert_body
	let alert_visible = false
	let username = ""
	let password = ""
	let mode = 0 // 0: normal , 1: advanced
	let loggedin = false
	let status = ""
	let select_status = ""
	let vehicles = []

	const teslaLogin = "https://auth.openevse.com/login"
	let range_unit = [{name: "km", value: false}, {name: "miles", value: true}]

	onMount(() => {
		loggedin = have_credentials()
		getVehicles()
	})

	async function getVehicles() {
		if (loggedin) {
			status = "loading"
			// fetch vehicle list
			let res = await serialQueue.add(()=>tesla_store.download())
			if (res) {
				if ($tesla_store.count)
					status = "ok"
				else status = ""

			}
			else status = "error"
		}
		if ($tesla_store.count) {
			for (let [i, ve] of  $tesla_store.vehicles.entries()) {
				vehicles[i] = {name: ve.name, value: ve.id}
			}
		}
	}

	async function selectVehicle(id) {
		select_status = "loading"

		const data = {
			tesla_vehicle_id: id
		}

		let res = await serialQueue.add(()=>config_store.upload(data))

		if (await res) {
			select_status = "ok"
			return true
			}
		else {
			select_status = "error"
			return false
		}
	}


	let login = async () => {

		stg_submit_state = "loading"

		const data = {
			username: username,
			password: password
		}

		let res = await serialQueue.add(() => httpAPI("POST", teslaLogin, data))

		if (await res.ok) {
				const data = {
					tesla_enabled: true,
					tesla_access_token: res.access_token,
					tesla_refresh_token: res.refresh_token,
					tesla_created_at: res.created_at,
					tesla_expires_in: res.expires_in,
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
				tesla_expires_in: 3888000,
				//using mqtt_vehicles_range_miles to store range unit
				mqtt_vehicle_range_miles: $config_store.mqtt_vehicle_range_miles
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
	$: loggedin, getVehicles()

</script>
<div class="mb-1">
	<Select title={$_("config.vehicle.rangeunit")} bind:value={$config_store.mqtt_vehicle_range_miles} items={range_unit} />
	{#if loggedin}
		{#if status == "loading"}
		<div>{$_("config.vehicle.tesla-fetching")}</div>
		{:else if $tesla_store.count}
		<Select title="{$_("config.vehicle.tesla-select")}:" bind:value={$config_store.tesla_vehicle_id} status={select_status} items={vehicles} onChange={()=>selectVehicle($config_store.tesla_vehicle_id)}/>
		{:else if status == "error"}
		<div>{$_("config.vehicle.tesla-fetching-error")}</div>
		{:else}
		<div>{$_("config.vehicle.tesla-fetching-novehicle")}</div>
		{/if}
		<div class="block mt-5">
			<Button name={$_("config.vehicle.logout")} color="is-info" state={stg_submit_state} butn_submit={logout} />
		</div>
		{:else if mode == 0}
		<div>
			<form on:submit|preventDefault>
				<InputForm title="{$_("config.vehicle.username")}:" bind:value={username} placeholder={$_("config.vehicle.username-desc")} />
				<InputForm title="{$_("config.vehicle.password")}:" bind:value={password} type="password" placeholder={$_("config.vehicle.password-desc")} />
			</form>

			<div class="block mt-5">
				<Button name={$_("config.vehicle.login")} color="is-info" state={stg_submit_state} butn_submit={login} />
				<Button name={$_("config.vehicle.advanced")} color="is-info" butn_submit={()=>mode=1} />
			</div>
		</div>
		{:else if mode == 1}
		<div>
			<InputForm title="Access Token:" bind:value={$config_store.tesla_access_token} type="password" placeholder="" />
			<InputForm title="Refresh Token:" bind:value={$config_store.tesla_refresh_token} type="password" placeholder="" />
			<div class="block mt-5">
				<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
				<Button name={$_("config.vehicle.normal")} color="is-info" butn_submit={()=>mode=0} />
			</div>
		</div>
	{/if}
	<AlertBox title={$_("error")}  body={alert_body} bind:visible={alert_visible} />
</div>