<script>
	import { _ } 		  	 	from 'svelte-i18n'
	import { onMount } 			from "svelte";
	import { status_store } 	from "../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { submitFormData } 	from "../../../lib/utils.js"
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch				from "../../ui/Switch.svelte";
	import Borders 				from "../../ui/Borders.svelte";

	let mounted = false
	const hiddenpass = "••••••••••"
	let formdata = {
			emoncms_enabled: {val: false, status: "", input: undefined, req: false},
			emoncms_server:	{val: null,  status: "", input: undefined, req: true},
			emoncms_node:	{val: null,  status: "", input: undefined, req: true},
			emoncms_apikey:	{val: null,  status: "", input: undefined, req: true, pwd: true}
		}	

	let updateFormData = () => {
		formdata.emoncms_enabled.val = $config_store.emoncms_enabled
		formdata.emoncms_server.val = $config_store.emoncms_server	
		formdata.emoncms_node.val = $config_store.emoncms_node	
		formdata.emoncms_apikey.val = $config_store.emoncms_apikey?hiddenpass:""
	}

	let toggleEmonCMS = async () => {
		await submitFormData({form: formdata, prop_enable: "emoncms_enabled", i18n_path: "config.emon.missing-"})
	}


	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , prop_enable: "emoncms_enabled", i18n_path: "config.emon.missing-"})
	}

	onMount( () => {
		updateFormData()
		mounted = true

	})
</script>
<style>
	.enable {
		min-width: 230px;
	}
	
</style>

<Box title={$_("config.titles.emon")} icon="fa6-solid:chart-bar" back={true}>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			
			<div class="mb-2 enable is-flex is-align-items-center is-justify-content-center">
				<Borders classes={$config_store.ohm_enabled?"has-background-primary-light":"has-background-light"}>
					<Switch 
					name="emoncmsswitch" 
					label={$_("enable")} 
					onChange={toggleEmonCMS} 
					bind:this={formdata.emoncms_enabled.input} 
					bind:checked={formdata.emoncms_enabled.val} 
					bind:status={formdata.emoncms_enabled.status} 
					disabled={formdata.emoncms_enabled.status == "loading"}
					/>
					<!-- <Switch name="emoncmsswitch" label={$_("config.emon.enable")} onChange={toggleEmonCMS} bind:checked={$config_store.emoncms_enabled} is_rtl={true}/> -->
					{#if $config_store.emoncms_enabled}
					<div class="is-size-7">
						<span class="">{$_("config.emon.connected")}:</span>
						{#key $status_store.emoncms_connected }
						<span class="has-text-weight-bold {$status_store.emoncms_connected == 1 ?"has-text-primary":"has-text-danger"}">{$status_store.emoncms_connected == 1 ?$_("yes"):$_("no")}</span>
						{/key}
						<span class="ml-2">{$_("config.emon.posts")}:</span>
						<span class="">{$status_store.packets_success}/{$status_store.packets_sent}</span>
					</div>
					{/if}
				</Borders>
			</div>
			<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
				<Borders grow>
					<InputForm 
						title="{$_("config.emon.server")}*" 
						bind:this={formdata.emoncms_server.input} 
						type="txt" bind:value={formdata.emoncms_server.val} 
						bind:status={formdata.emoncms_server.status} 
						disabled={formdata.emoncms_server.status == "loading"} 
						placeholder="" 
						onChange={()=>setProperty("emoncms_server")}
					/>
					<div class="is-size-7">e.g: <a href="https://data.openevse.com/emoncms">data.openevse.com/emoncms</a>, <a href="https://emoncms.org/">emoncms.org</a>, <a href="http://emonpi/">emonpi</a></div>
					
					<InputForm 
						title="{$_("config.emon.node")}*" 
						bind:this={formdata.emoncms_node.input} 
						type="txt" bind:value={formdata.emoncms_node.val} 
						bind:status={formdata.emoncms_node.status} 
						disabled={formdata.emoncms_node.status == "loading"} 
						placeholder="" 
						onChange={()=>setProperty("emoncms_node")}
					/>
					<InputForm 
						title="{$_("config.emon.apikey")}*" 
						bind:this={formdata.emoncms_apikey.input} 
						type="password" bind:value={formdata.emoncms_apikey.val} 
						bind:status={formdata.emoncms_apikey.status} 
						disabled={formdata.emoncms_apikey.status == "loading"} 
						placeholder="" 
						onChange={()=>setProperty("emoncms_apikey")}
					/>
				</Borders>
			</div>
		
		</div>
	</div>
</Box>