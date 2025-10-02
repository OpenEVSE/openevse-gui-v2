<script>
	import Firmware from "./../../../routes/Firmware.svelte";
	import Limit from "./../main/Limit.svelte";
	import { serialQueue }  from "./../../../lib/queue.js";
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
	let scaleoffset_submit_state = ""
	const states_items = [{name: $_("disabled"), value: false}, {name: $_("active"), value: true}]
	const service_items = [{name: "Auto", value: 0},{name: "Level 1", value: 1},{name: "Level 2", value: 2}]
	const phase_items = [{name: $_("no"), value: false}, {name: $_("yes"), value: true}]

	let formdata = {
			max_current: 			    {val: 32,  status: "", input: undefined, req: false},
			max_current_soft: 		{val: 32,  	  status: "", input: undefined, req: false},
			max_current_hard: 		{val: 32,  status: "", input: undefined, req: false},
			default_state:			{val: false,  status: "", input: undefined, req: false},
			is_threephase:			{val: false,  status: "", input: undefined, req: false},
			scheduler_start_window:	{val: 0,      status: "", input: undefined, req: false},
			scale:                  {var: 220,    status: "", input: undefined, req: false},
			offset:					{var: 0,      status: "", input: undefined, req: false},
			pause_uses_disabled:	{val: null,   status: "", input: undefined, req: false},
			service:				{val: false,  status: "", input: undefined, req: false},
			led_brightness:			{val: "",     status: "", input: undefined, req: false}
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
		formdata.scale.val = $config_store.scale
		formdata.offset.val = $config_store.offset
		formdata.pause_uses_disabled.val =  $config_store.pause_uses_disabled
		formdata.service.val = $config_store.service
		formdata.led_brightness.val = $config_store.led_brightness
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
		await submitFormData({prop: prop, form: formdata , i18n_path: "config.evse.missing-"})
	}

	let scaleoffset_submit = async () => {

		formdata.scale.status = "loading"
		formdata.offset.status = "loading"

		const data = {
			scale: formdata.scale.val,
			offset: formdata.offset.val
		}

		if (await serialQueue.add(()=>config_store.upload(data)))
			{
				formdata.scale.status = "ok"
				formdata.offset.status = "ok"
				return true
			}
		else {
			formdata.scale.status = "error"
			formdata.offset.status = "error"
			return false
		}
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
	<div class="columns is-centered is-vcentered has-text-dark">
		<div class="column is-two-thirds">
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true} has_help>
					<div slot="help">
						{@html $_("config.evse.maxcur-help")}
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6">{$_("config.evse.maxcur")}</div>
          <SliderForm icon="fa6-solid:gauge-high"
						bind:value={formdata.max_current.val}
						unit={$_("units.A")}
						min={$config_store.min_current_hard?$config_store.min_current_hard:6}
						max={$config_store.max_current_hard?$config_store.max_current_hard:32}
						onchange={()=>{ if(false === set_hardware_max) { setProperty("max_current_soft")}} }
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
			<div class="my-1 is-flex is-justify-content-center" >
				<Limit is_admin={true}/>
			</div>

			{#if $config_store.default_state !== 'undefined'}
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true} has_help={true}>
					<div slot="help">
						{@html $_("config.evse.defaultstate-help")}
					</div>
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
				<Borders grow={true} has_help>
					<div slot="help">
						{@html $_("config.evse.threephase-help")}
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.threephase")}</div>
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
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.random")}</div>
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
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true} has_help={true}>
					<div slot="help">
						{@html $_("config.evse.scale")}
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.sensorscale")}</div>
					<div class="is-flex is-justify-content-center is-align-items-center">
						<div class="inputbox">
							<InputForm
								is_inline type="number" min=0 max=3600
								bind:this={formdata.scale.input}
								bind:value={formdata.scale.val}
								bind:status={formdata.scale.status}
								onChange={()=>scaleoffset_submit()}
							/>
						</div>
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.sensoroffset")}</div>
					<div class="is-flex is-justify-content-center is-align-items-center">
						<div class="inputbox">
							<InputForm
								is_inline type="number" min=0 max=3600
								bind:this={formdata.offset.input}
								bind:value={formdata.offset.val}
								bind:status={formdata.offset.status}
								onChange={()=>scaleoffset_submit()}
							/>
						</div>
					</div>
				</Borders>
			</div>
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.service")}</div>
					<Select
						bind:this={formdata.service.input}
						bind:value={formdata.service.val}
						bind:status={formdata.service.status}
						items={service_items}
						onChange={()=>setProperty("service")}
					/>
				</Borders>
			</div>
			<div class="my-1 is-flex is-justify-content-center" >
				<Borders grow={true} has_help={true}>
					<div slot="help">
						{@html $_("config.evse.pause-help")}
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.pause")}</div>
					<Switch
						name="pausemode"
						label="{formdata.pause_uses_disabled.val?"Disable":"Sleep"}"
						bind:this={formdata.pause_uses_disabled.input}
						bind:checked={formdata.pause_uses_disabled.val}
						bind:status={formdata.pause_uses_disabled.status}
						onChange={()=>setProperty("pause_uses_disabled")}
					/>
				</Borders>
			</div>
			{#if $config_store.led_brightness != undefined}
			<div class="mt-1 is-flex is-justify-content-center " >

				<Borders grow={true} has_help>
					<div slot="help">
						{@html $_("config.evse.led-bn-help")}
					</div>
					<div class="is-uppercase has-text-weight-bold is-size-6 mb-3">{$_("config.evse.led-bn")}</div>
					<SliderForm
						icon="ic:outline-light-mode"
						bind:value={formdata.led_brightness.val}
						min=0 max=255
						onchange={()=>setProperty("led_brightness")}
					/>
				</Borders>
			</div>
			{/if}
		</div>
	</div>

</Box>
{/if}
