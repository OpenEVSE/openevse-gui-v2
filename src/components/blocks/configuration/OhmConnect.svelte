<script>
	import OhmHelp from "./../../help/OhmHelp.svelte";
	import { onMount } 			from "svelte";
	import { _ } 		    	from 'svelte-i18n'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { submitFormData } 	from "./../../../lib/utils.js"
	import Borders 				from "./../../ui/Borders.svelte";
	import InputForm 			from "./../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch 				from "./../../ui/Switch.svelte";


	let mounted = false
	const hiddenpass = "••••••••••"
	let formdata = {
			ohm_enabled: {val: false, status: "", input: undefined, req: false},
			ohm:	{val: null,  status: "", input: undefined, req: true, pwd: true}
		}	

	let updateFormData = () => {
		formdata.ohm_enabled.val = $config_store.ohm_enabled
		formdata.ohm.val = $config_store.ohm?hiddenpass:""
	}

	let toggleOhm = async () => {
		await submitFormData({form: formdata, prop_enable: "ohm_enabled", i18n_path: "config.ohm.missing-"})
	}


	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , prop_enable: "ohm_enabled", i18n_path: "config.ohm.missing-"})
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

{#if mounted}
<Box title={$_("config.titles.ohm")} icon="mdi:energy-circle" back={true} has_help={true}>
	<div slot="help"><OhmHelp /></div>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			
			<div class="mb-2 enable is-flex is-align-items-center is-justify-content-center">
				<Borders classes={$config_store.ohm_enabled?"has-background-primary-light":"has-background-light"}>
					<div>
						<Switch 
						name="ohmswitch" 
						label={$_("enable")} 
						onChange={toggleOhm} 
						bind:this={formdata.ohm_enabled.input} 
						bind:checked={formdata.ohm_enabled.val} 
						bind:status={formdata.ohm_enabled.status} 
						disabled={formdata.ohm_enabled.status == "loading"}
						/>
					
					</div>
					{#if $config_store.ohm_enabled}
					<div class="is-size-7">
						<span class="">Ohm Hour:</span>
						<span class="has-text-weight-bold {$status_store.ohm_hour == "NotConnected" ?"has-text-danger":"has-text-primary"}">{$status_store.ohm_hour}</span>
					</div>
					{/if}
				</Borders>
			</div>

			<div class="mb-2 is-flex is-align-items-center is-justify-content-center is-flex-direction-column ">
				<Borders grow>
					<InputForm
						title="{$_("config.ohm.ohmkey")}*" 
						bind:this={formdata.ohm.input} 
						type="password" bind:value={formdata.ohm.val} 
						bind:status={formdata.ohm.status} 
						disabled={formdata.ohm.status == "loading"} 
						placeholder="" 
						onChange={()=>setProperty("ohm")}
					/>
				</Borders>
			</div>
		</div>
	</div>
</Box>
{/if}