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


	let alert_visible = false
	let languages = []

	let formdata = {
		www_username: {val: "",   state: ""},
		www_password: {val: "",   state: ""},
		lang:		  {val: "en", state: ""},
	}
	
	let auth_checked = false
	let auth_submit_state = ""

	$locales.forEach(lang => {
		languages.push({name: lang, value: lang})
	});
	
	let auth_submit = async () => {
		
		if ( auth_checked && (!formdata.www_username.val || !formdata.www_password.val )) {
			alert_visible = true
			auth_submit_state = ""
			auth_checked = false
			return false
		}
		else {
			auth_submit_state = "loading"

			if ( !auth_checked ) {
				formdata.www_username.val = ""
				formdata.www_password.val = ""
			}
			const data = {
			www_username: formdata.www_username.val,
			}
			if (formdata.www_password.val != "_DUMMY_PASSWORD")
				data.www_password = formdata.www_password.val

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
	}

	let getAuthData = (u,p) => {
		formdata.www_username.val = u
		formdata.www_password.val = p
		if (p == "_DUMMY_PASSWORD") 
			formdata.www_password.val = ""
		if (u || p)  {
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
		formdata.lang.val = $config_store.lang?$config_store.lang:"en"
		getAuthData($config_store.www_username,$config_store.www_password)
	})
	$: console.log("login state: " + formdata.www_username.state)

	// $: getAuthData($config_store.www_username,$config_store.www_password)
	// $: $config_store.lang, () => {formdata.lang.val = $config_store.lang}
	
</script>

<Box title={$_("config.titles.http")} icon="mdi:web" back={true}>
	<div class="columns is-centered">
		<div class="column is-two-thirds">
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold">{$_("config.http.enable")}</div>
					<form class="has-text-left">
						<Switch name="auth_enabled" label={auth_checked?$_("enabled"):$_("disabled")} bind:checked={auth_checked} onChange={auth_submit} bind:status={auth_submit_state}/>
						<div><InputForm  title={$_("config.http.username")} bind:value={formdata.www_username.val} placeholder={$_("config.http.inputmax")} type="text" maxlength=15 bind:status={formdata.www_username.state}/></div>
						<div><InputForm title={$_("config.http.password")} bind:value={formdata.www_password.val} placeholder={$_("config.http.inputmax")} type="password" maxlength=15 bind:status={formdata.www_password.state}/></div>
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
<AlertBox title={$_("error")} body={$_("config.http.errormsg")} bind:visible={alert_visible}/>