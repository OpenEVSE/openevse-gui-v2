<script>
	import { onMount } from "svelte";
	import { _ } 			 	 from 'svelte-i18n'
	import Borders 				 from "./../../ui/Borders.svelte";
	import Select				 from "./../../ui/Select.svelte";
	import SliderForm 		     from "./../../ui/SliderForm.svelte";
	import { config_store } 	 from "./../../../lib/stores/config.js";
	import InputForm 			 from "./../../ui/InputForm.svelte";
	import Box 					 from "./../../ui/Box.svelte";
	import { submitFormData } 	 from "./../../../lib/utils.js"
	import Switch from "./../../ui/Switch.svelte";

	let mounted = false
	const states_items = [{name: $_("disabled"), value: false}, {name: $_("active"), value: true}]
	const phase_items = [{name: $_("no"), value: false}, {name: $_("yes"), value: true}]

	let formdata = {
			max_current: 			{val: false,  status: "", input: undefined, req: false},
			max_current_soft: 		{val: false,  status: "", input: undefined, req: false},
			max_current_hard: 		{val: false,  status: "", input: undefined, req: false},
			default_state:			{val: false,  status: "", input: undefined, req: false},
			is_threephase:			{val: false,  status: "", input: undefined, req: false},
			scheduler_start_window:	{val: null,   status: "", input: undefined, req: false}
	}

	let set_hardware_max = false;
	let hardware_max_disabled = $config_store.max_current_hard != $config_store.max_current_firmware;

	let updateFormData = () => {
		formdata.max_current.val = $config_store.max_current_soft
		formdata.max_current_soft.val = $config_store.max_current_soft
		formdata.max_current_hard.val = $config_store.max_current_hard
		formdata.default_state.val = $config_store.default_state
		formdata.is_threephase.val = $config_store.is_threephase
		formdata.scheduler_start_window.val = $config_store.scheduler_start_window
	}

	let setProperty = async (prop) => {
		if("max_current_hard" == prop) {
			formdata.max_current_hard.val = formdata.max_current.val;
			set_hardware_max = false;
			hardware_max_disabled = true;
		}
		if ("max_current_soft" == prop) {
			formdata.max_current_soft.val = formdata.max_current.val
		}
		await submitFormData({prop: prop, form: formdata})
	}

	onMount(()=> {
		updateFormData()
		mounted = true
	})
</script>

{#if mounted}
<Box title={$_("config.titles.evse")} icon="mdi:evse" back={true}>
	<div class="columns is-centered is-vcentered">
		<div class="column is-two-thirds">
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold is-size-6">{$_("config.evse.maxcur")}</div>
					<SliderForm icon="fa6-solid:gauge-high"
						bind:value={formdata.max_current.val}
						unit={$_("units.A")}
						min={$config_store.min_current_hard?$config_store.min_current_hard:6}
						max={$config_store.max_current_hard?$config_store.max_current_hard:32}
						onchange={()=>{ if(false === set_hardware_max) { setProperty("max_current_soft")}}}
					/>
					<div class="mt-2">
						<Switch name="set_hardware_max" bind:checked={set_hardware_max} label="{$_("config.evse.set_hardware_max")}" disabled={hardware_max_disabled} />
					</div>
					{#if set_hardware_max}
						<div class="notification is-warning mt-2">
						{@html $_("config.evse.set_hardware_max_warning")}
						<div class="mt-2 has-text-centered">
							<button class="button" on:click={() => setProperty("max_current_hard")}>
								{$_("config.evse.confirm_set_hardware_max")}
							</button>
						</div>
						</div>
					{/if}
				</Borders>
			</div>
			{#if $config_store.default_state !== 'undefined'}
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.defaultstate")}</div>
					<Select
						bind:this={formdata.default_state.input}
						bind:value={formdata.default_state.val}
						bind:status={formdata.default_state.status}
						items={states_items}
						onChange={()=>setProperty("default_state")}
					/>
				</Borders>
			</div>
			{/if}
			{#if $config_store.is_threephase !== 'undefined'}
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold is-size-6 mb-3">{$_("config.evse.threephase")}</div>
					<Select
						bind:this={formdata.is_threephase.input}
						bind:value={formdata.is_threephase.val}
						bind:status={formdata.is_threephase.status}
						items={phase_items}
						onChange={()=>setProperty("is_threephase")}
					/>
				</Borders>
			</div>
			{/if}
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
