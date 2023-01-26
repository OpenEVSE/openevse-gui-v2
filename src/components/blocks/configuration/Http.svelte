<script>
	import Button from "./../../ui/Button.svelte";
	import { serialQueue } 			from "./../../../lib/queue.js";
	import Borders 					from "./../../ui/Borders.svelte";
	import Select 					from "./../../ui/Select.svelte";
	import { _ , locales} 			from 'svelte-i18n'
	import { config_store } 		from "./../../../lib/stores/config.js";
	import {onMount} 				from "svelte"
	import AlertBox					from "./../../ui/AlertBox.svelte";
	import Switch 					from "../../ui/Switch.svelte";
	import InputForm 				from "../../ui/InputForm.svelte";
	import Box 						from "../../ui/Box.svelte"

	let mounted = false
	let alert_body
	let alert_visible = false
	const hiddenpass = "••••••••••"

	let languages = []

	let formdata = {
		www_username: {val: "",   state: "", req: true},
		www_password: {val: "",   state: "", req: true},
		lang:		  {val: "en", state: "", req: false},
	}
	
	let auth_checked = false
	let auth_submit_state = ""

	
	
	let auth_submit = async () => {
		let reqfields_ok = true
		let data = {}
		if (auth_checked) {
			for (const key of Object.keys(formdata)) {
				if (formdata[key].req) {
					if (formdata[key].val == "") {
						alert_body = $_("config.http.missing-" + key)
						alert_visible = true
						auth_checked = false
						reqfields_ok = false
						return
					}
				}
				data[key] = formdata[key].val
			}
			if ( formdata.www_password.val && formdata.www_password.val != hiddenpass) {
				data.www_password = formdata.www_password.val
			} else delete data.www_password
		}
		else {
			data.www_username = formdata.www_username.val = ""
			data.www_password = formdata.www_password.val = ""
		}

		if (!reqfields_ok)
			return false

		
		
		auth_submit_state = "loading"
		if (await serialQueue.add(() => config_store.upload(data))) 
			{
				auth_submit_state = "ok"
				return true
			}
		else {
			auth_submit_state = "error"
			return false
		}

	}

	let getAuthData = (u,p) => {
		formdata.www_username.val = u
		formdata.www_password.val = p
		if (p) 
			formdata.www_password.val = hiddenpass
		if (u && p)  {
			auth_checked = true
			return true
		}
			
		else {
			auth_checked = null
			return false
		}	
	}
	
	let setProperty = async (prop) => {
		const props = {}
		props[prop] = formdata[prop].val
		formdata[prop].state = "loading"
		if (await config_store.upload(props)) 
			{
			formdata[prop].state = "ok"
			return true
			}
		else {
			formdata[prop].state = "error"
			formdata[prop].val = $config_store[prop]
			return false
		}
	}

	onMount(() => {
		$locales.forEach(lang => {
			languages.push({name: lang, value: lang})
		});
		formdata.lang.val = $config_store.lang?$config_store.lang:"en"
		getAuthData($config_store.www_username,$config_store.www_password)
		mounted = true
	})

	$: console.log("login state: " + formdata.www_username.state)
	
</script>

{#if mounted}
<Box title={$_("config.titles.http")} icon="mdi:web" back={true}>
	<div class="columns is-centered">
		<div class="column is-two-thirds">
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold">{$_("config.http.enable")}</div>
					<form class="has-text-left" on:submit|preventDefault>
						<div class="is-flex is-justify-content-space-evenly is-flex-wrap-wrap">
							<Borders grow={false} classes={auth_checked?"has-background-primary-light":"has-background-light"}>
								<Switch name="auth_enabled" label={auth_checked?$_("enabled"):$_("disabled")} bind:checked={auth_checked} onChange={auth_submit} bind:status={auth_submit_state}/>
							</Borders>
							<div class="mx-1">
								<InputForm size=20 title={$_("config.http.username")} bind:value={formdata.www_username.val} placeholder={$_("config.http.inputmax")} type="text" maxlength=15 bind:status={formdata.www_username.state}/>
							</div>
							<div class="mx-1">
							<InputForm size=20 title={$_("config.http.password")} bind:value={formdata.www_password.val} placeholder={$_("config.http.inputmax")} type="password" maxlength=15 bind:status={formdata.www_password.state}/>
							</div>
						</div>
						<div class="has-text-centered" class:is-hidden={!auth_checked}>
							<Button name={$_("update")} bind:state={auth_submit_state} disabled={!formdata.www_username.val || !formdata.www_password.val } butn_submit={auth_submit}/>
						</div>
					</form>
				</Borders>
			</div>
			<div class="my-2 is-flex is-justify-content-center">
				<Borders grow={true}>
				<div class="block has-text-centered">
					<div class="has-text-weight-semibold mb-1">{$_("config.http.lang")}</div>
					{#key formdata.lang.state}
					<Select bind:value={formdata.lang.val} items={languages} bind:status={formdata.lang.state} onChange={async ()=> { await setProperty("lang")}}/>
					{/key}
				</div>
				</Borders>
			</div>
		</div>
	</div>
</Box>
<AlertBox title={$_("error")} body={alert_body} bind:visible={alert_visible}/>
{/if}