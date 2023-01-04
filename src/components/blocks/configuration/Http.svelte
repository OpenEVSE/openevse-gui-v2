<script>
	import { _ } 		    from 'svelte-i18n'
	import { config_store } from "./../../../lib/stores/config.js";
	import {onMount} 		from "svelte"
	import Tabs 			from "./../../ui/Tabs.svelte";
	import AlertBox			from "./../../ui/AlertBox.svelte";
	import Switch 			from "../../ui/Switch.svelte";
	import InputForm 		from "../../ui/InputForm.svelte";
	import Box 				from "../../ui/Box.svelte"
	import Button 			from "../../ui/Button.svelte"

	let alert_visible = false
	let activetab = 0

	//Auth
	let auth_checked = false
	let auth_https_checked = false
	let auth_submit_state = "default"
	let auth_usr
	let auth_pwd

	//Settings
	let stg_submit_state
	let stg_has_https
	let stg_language = 'en'

	const stg_langs = [
		{name: "English", code: "en"},
		{name: "Français",  code: "fr"}
	]

	let clickTab = (i) => {
		activetab = i
	}

	let tabs = [
		{name: $_("config.http.authentication"), url:"/configuration/http"},
		{name: $_("config.http.settings"), url:"/configuration/http"}
	]

	let stg_submit = async () => {
		stg_submit_state = "loading"
	
		const data = {
		lang: stg_language
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
	
	let auth_submit = async () => {
		auth_submit_state = "loading"
		if ( auth_checked && (!auth_usr || !auth_pwd )) {
			alert_visible = true
			auth_submit_state = "default"
			return false
		}
		else {
			const data = {
			www_username: auth_checked?auth_usr:"",
			lang: stg_language
			}
			if (auth_pwd != "_DUMMY_PASSWORD")
				data.www_password = auth_pwd

			if (await config_store.upload(data)) 
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
		auth_usr = u
		auth_pwd = p
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
				if (p === "https") stg_has_https = true
				else stg_has_https = false
			})
		}
		stg_language = $config_store.lang
	})


	$: getAuthData($config_store.www_username,$config_store.www_password)
	$: $config_store.lang, () => {stg_language = $config_store.lang}
	
</script>

<Box title={$_("config.titles.http")} icon="mdi:web">
	<Tabs tabs={tabs} {activetab} onClick={clickTab}/>
	{#if activetab == 0}
	<!-- Authentication -->
	<div class="my-1" >
		<form>
			<Switch name="auth_enabled" label={$_("config.http.enable")} tooltip={$_("config.http.enable-ttip")} tooltip_pos="right" bind:checked={auth_checked} />
			<div><InputForm  title={$_("config.http.username")} bind:value={auth_usr} placeholder="Admin" type="text" disabled={!auth_checked} /></div>
			<div><InputForm title={$_("config.http.password")} bind:value={auth_pwd} placeholder={$_("config.http.inputmax")} type="password" maxlength=15 disabled={!auth_checked} /></div>
			<Button name={$_("save")} color="is-info" state={auth_submit_state} butn_submit={auth_submit} />
		</form>
	</div>
	{:else if activetab == 1}
	<!-- Settings -->
	<div class="my-2">
		<div class="block">
			<Switch name="https_enabled" label={$_("config.http.enablehttps")} bind:checked={auth_https_checked} disabled={!stg_has_https} />
			{#if !stg_has_https}
			<div class=" is-size-7 is-italic">{$_("config.http.nohttps")}</div>
			{/if}
		</div>
		<div class="block">
			<div class="has-text-weight-semibold mb-1">{$_("config.http.lang")}</div>
			<div class="select is-info">		
				<select bind:value={stg_language}>
					{#each stg_langs as lang}
					<option value={lang.code}>{lang.name}</option>
					{/each}	
				</select>
			</div>
		</div>
		<div class="block">
			<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
		</div>
			
		
	</div>
	{/if}
</Box>
<AlertBox title={$_("error")} body={$_("config.http.errormsg")} bind:visible={alert_visible}/>