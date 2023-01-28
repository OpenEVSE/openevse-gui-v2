<script>
	import { onMount } from "svelte";
	import { _ } 			 	 from 'svelte-i18n'
	import Borders 				 from "./../../ui/Borders.svelte";
	import Select				 from "./../../ui/Select.svelte";
	import Help					 from "./../../ui/Help.svelte";
	import Switch				 from "./../../ui/Switch.svelte";
	import SliderForm 		     from "./../../ui/SliderForm.svelte";
	import { config_store } 	 from "./../../../lib/stores/config.js";
	import InputForm 			 from "./../../ui/InputForm.svelte";
	import Box 					 from "./../../ui/Box.svelte";
	import { submitFormData } 	 from "./../../../lib/utils.js"

	let mounted = false
	const service_items = [{name: "Auto", value: 0},{name: "Level 1", value: 1},{name: "Level 2", value: 2}]
	
	let formdata = {
			max_current_soft: 		{val: false,  status: "", input: undefined, req: false},
			scheduler_start_window:	{val: null,   status: "", input: undefined, req: false}
		}	

	let updateFormData = () => {
		formdata.max_current_soft.val = $config_store.max_current_soft
		formdata.scheduler_start_window.val = $config_store.scheduler_start_window
	}

	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , i18n_path: "config.shaper.missing-"})
	}
	
	onMount(()=> {
		updateFormData()
		mounted = true
	})
</script>

<style>
	/* .inputbox {
		max-width: 100px;
	} */
</style>

{#if mounted}
<Box title={$_("config.titles.evse")} icon="mdi:evse" back={true}>
	<div class="columns is-centered is-vcentered">
		<div class="column is-two-thirds">
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold is-size-6">{$_("config.evse.maxcur")}</div>
					<SliderForm icon="fa6-solid:gauge-high" 
						bind:value={formdata.max_current_soft.val} 
						unit={$_("units.A")} 
						min={$config_store.min_current_hard?$config_store.min_current_hard:6} 
						max={$config_store.max_current_hard?$config_store.max_current_hard:32} 
						onchange={()=>setProperty("max_current_soft")} 
					/>
				</Borders>
			</div>
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true} has_help={true}>
					<div slot="help">
						{@html $_("config.evse.random-help")}
					</div>
					<div class="has-text-weight-bold is-size-6 mb-3">{$_("config.evse.random")}</div>
					<div class="is-flex is-justify-content-center is-align-items-center">
						<div class="inputbox">	
							<InputForm 
								is_inline type="number" min=0 max=3600  
								bind:this={formdata.scheduler_start_window.input}
								bind:value={formdata.scheduler_start_window.val} 
								bind:status={formdata.scheduler_start_window.status} 
								onChange={()=>setProperty("scheduler_start_window")}
							/>
						</div>
						<div class="ml-2 is-inline-block"> {$_("config.evse.seconds")}</div>
					</div>
				</Borders>
			</div>
		</div>	
	</div>

</Box>
{/if}