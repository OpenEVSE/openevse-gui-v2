<script>
	import { onMount } 			from "svelte";
	import { _ } 		    	from 'svelte-i18n'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { submitFormData } 	from "./../../../lib/utils.js";
	import MQTThelp 			from "./../../help/MQTThelp.svelte";
	import Select 				from "./../../ui/Select.svelte";
	import Borders 				from "./../../ui/Borders.svelte";
	import InputForm 			from "./../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch 				from "./../../ui/Switch.svelte";

	let mounted = false
	const hiddenpass = "••••••••••"
	let protocols = []

	let formdata = {
			mqtt_enabled: 			  {val: false, 		input: undefined, status: "", req: false},
			mqtt_protocol:			  {val: undefined, 	input: undefined, status: "", req: false},
			mqtt_server:   			  {val: undefined, 	input: undefined, status: "", req: true},
			mqtt_port:				  {val: 1883, 		input: undefined, status: "", req: true},
			mqtt_reject_unauthorized: {val: true, 		input: undefined, status: "", req: false},
			mqtt_user: 				  {val: undefined,	input: undefined, status: "", req: false},
			mqtt_pass: 				  {val: undefined,	input: undefined, status: "", req: false, pwd: true},
			mqtt_topic: 		      {val: undefined, 	input: undefined, status: "", req: true},
			mqtt_announce_topic:	  {val: undefined, 	input: undefined, status: "", req: false},
			mqtt_retained: 			  {val: true, 		input: undefined, status: "", req: false},
			mqtt_vrms:				  {val: undefined, 	input: undefined, status: "", req: false}
		}	

	let updateFormData = () => {
		formdata.mqtt_enabled.val 			  = $config_store.mqtt_enabled
		formdata.mqtt_protocol.val 			  = $config_store.mqtt_protocol
		formdata.mqtt_server.val 			  = $config_store.mqtt_server
		formdata.mqtt_port.val 				  = $config_store.mqtt_port
		formdata.mqtt_reject_unauthorized.val = $config_store.mqtt_reject_unauthorized
		formdata.mqtt_user.val 				  = $config_store.mqtt_user
		formdata.mqtt_pass.val 				  = $config_store.mqtt_pass?hiddenpass:""
		formdata.mqtt_topic.val 			  = $config_store.mqtt_topic
		formdata.mqtt_announce_topic.val 	  = $config_store.mqtt_announce_topic
		formdata.mqtt_retained.val 			  = $config_store.mqtt_retained
		formdata.mqtt_vrms.val 				  = $config_store.mqtt_vrms
	}

	let toggleMQTT = async () => {
		await submitFormData({form: formdata, prop_enable: "mqtt_enabled", i18n_path: "config.mqtt.missing-"})
	}
	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , prop_enable: "mqtt_enabled", i18n_path: "config.mqtt.missing-"})
	}

	onMount(() => {
		$config_store.mqtt_supported_protocols.forEach(proto => {
			protocols.push({name: proto, value: proto})
		});
		updateFormData()
		Object.keys(formdata).forEach(key => {
			if (formdata[key].val == undefined) {
				formdata[key].val = ""
			}
		});
		mounted = true
	})
</script>
<style>
	.enable {
		min-width: 230px;
	}
	
</style>
{#if mounted}
<Box title={$_("config.titles.mqtt")} has_help={true} icon="simple-icons:mqtt" back={true}>
	<div slot="help"><MQTThelp /> </div>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			
			<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
				<Borders classes={formdata.mqtt_enabled.val?"has-background-primary-light":"has-background-light"}>
					<div class="enable">
						<Switch 
							name="mqttswitch" 
							bind:this={formdata.mqtt_enabled.input}
							bind:checked={formdata.mqtt_enabled.val}
							bind:status={formdata.mqtt_enabled.status} 
							label={formdata.mqtt_enabled.val?$_("enabled"):$_("disabled")} 
							disabled={formdata.mqtt_enabled.status=="loading"}
							onChange={toggleMQTT}  
						/>
						<div class=" {formdata.mqtt_enabled.val?"":"is-hidden"}">
						{#key $status_store.mqtt_connected}
						<span class="tag has-text-weight-bold is-normal is-capitalized {$status_store.mqtt_connected?"is-primary":"is-danger"}">{$status_store.mqtt_connected?$_("connected"):$_("not-connected")}</span>
						{/key}
						</div>
					</div>
					
				</Borders>
			</div>
			<form on:submit|preventDefault>
				<div class="my-1 is-flex is-justify-content-center" >
					<Borders grow={true} classes="mb-4">
						<div class="has-text-centered">
							<div class="">
								<Select 
									items={protocols} 
									title={$_("config.mqtt.proto")}
									bind:this={formdata.mqtt_protocol.input}
									bind:value={formdata.mqtt_protocol.val}
									bind:status={formdata.mqtt_protocol.status} 
									onChange={()=> setProperty("mqtt_protocol")}/>
							
								<InputForm
									is_inline size={16} 
									title="{$_("config.mqtt.host")}*" 
									placeholder="server IP / Hostname" 
									bind:this={formdata.mqtt_server.input}
									bind:value={formdata.mqtt_server.val} 
									bind:status={formdata.mqtt_server.status} 
									onChange={()=>setProperty("mqtt_server")}
								/>
								<InputForm
									is_inline size={10} 
									title="{$_("config.mqtt.port")}*" 
									placeholder="1883" type="number" 
									bind:this={formdata.mqtt_port.input}
									bind:value={formdata.mqtt_port.val} 
									bind:status={formdata.mqtt_port.status} 
									onChange={()=>setProperty("mqtt_port")} 
								/>
							</div>
						</div>
						
						
						<div class="has-text-left mt-2">
							<Switch 
								name="mqttselfcert" 
								label={$_("config.mqtt.rejectselfsigned")} 
								bind:this={formdata.mqtt_reject_unauthorized.input}
								bind:checked={formdata.mqtt_reject_unauthorized.val} 
								bind:status={formdata.mqtt_reject_unauthorized.status} 
								onChange={()=>setProperty("mqtt_reject_unauthorized")}
							/>
						</div>
						<div class="is-flex is-justify-content-space-evenly is-flex-wrap-wrap">
							<div class="mx-1">
								<InputForm
									is_inline size={16}
									title={$_("config.mqtt.username")} 
									placeholder="Username" 
									bind:this={formdata.mqtt_user.input}
									bind:value={formdata.mqtt_user.val} 
									bind:status={formdata.mqtt_user.status} 
									onChange={()=>setProperty("mqtt_user")} 
								/>
							</div>
							<div class="mx-1">
								<InputForm is_inline size={16} 
									title={$_("config.mqtt.password")} 
									placeholder="Password" 
									type="password" 
									bind:this={formdata.mqtt_pass.input}
									bind:value={formdata.mqtt_pass.val} 
									bind:status={formdata.mqtt_pass.status} 
									onChange={()=>setProperty("mqtt_pass")} 
								/>
							</div>
						</div>
					</Borders>
				</div>
				<div class="my-1 is-flex is-justify-content-center" >
					<Borders grow={true}>
						<div>
							<InputForm 
								title="{$_("config.mqtt.basetopic")}*" 
								bind:this={formdata.mqtt_topic.input}
								bind:value={formdata.mqtt_topic.val} placeholder="openevse" 
								bind:status={formdata.mqtt_topic.status} 
								onChange={()=>setProperty("mqtt_topic")} 
							/>
							<div class="is-size-7 mb-2">{$_("config.mqtt.basetopic-desc")}</div>
						</div>
						<div>
							<InputForm 
								title="{$_("config.mqtt.announcetopic")}" 
								placeholder="openevse/announce/{$config_store.hostname}" 
								bind:this={formdata.mqtt_announce_topic.input}
								bind:value={formdata.mqtt_announce_topic.val} 
								bind:status={formdata.mqtt_announce_topic.status} 
								onChange={()=>setProperty("mqtt_announce_topic")} 
							/>
							<div class="is-size-7 mb-2">{$_("config.mqtt.announcetopic-desc")}</div>
						</div>
						
						<div class="has-text-left">
							<Switch 
								name="mqttretain" 
								label={$_("config.mqtt.retain")} 
								bind:this={formdata.mqtt_retained.input}
								bind:checked={formdata.mqtt_retained.val} 
								bind:status={formdata.mqtt_retained.status} 
								onChange={()=>setProperty("mqtt_retained")} 
							/>
						</div>
						
						<div class="mt-4">
							<InputForm 
								title={$_("config.mqtt.topic-voltage")} 
								placeholder="topic/voltage" 
								bind:this={formdata.mqtt_vrms.input}
								bind:value={formdata.mqtt_vrms.val} 
								bind:status={formdata.mqtt_vrms.status} 
								onChange={()=>setProperty("mqtt_vrms")} 
							/>
							<div class="is-size-7">
								{$_("config.mqtt.topic-voltage-desc")}
							</div>
						</div>

					</Borders>	
				</div>
			</form>
		</div>
	</div>
</Box>
{/if}