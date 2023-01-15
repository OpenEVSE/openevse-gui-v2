<script>
	import Select from "./../../ui/Select.svelte";
	import { onMount } from "svelte";
	import Borders from "./../../ui/Borders.svelte";
	import { _ } 		    from 'svelte-i18n'
	import { status_store } from "./../../../lib/stores/status.js";
	import MQTThelp 		from "./../../help/MQTThelp.svelte";
	import InputForm 		from "./../../ui/InputForm.svelte";
	import Box 				from "../../ui/Box.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import { serialQueue }  from "./../../../lib/queue.js";
	import Switch 			from "./../../ui/Switch.svelte";
	import AlertBox 		from "../../ui/AlertBox.svelte"

	// let mqtt_toggle_state

	let alert_body
	let alert_visible = false
	let formdata
	let mounted = false
	const hiddenpass = "••••••••••"
	let protocols = []

	let updateFormData = () => {
		formdata = {
			mqtt_enabled: 			  {val: $config_store.mqtt_enabled, state: "", req: false},
			mqtt_protocol:			  {val: $config_store.mqtt_protocol, state: "", req: false},
			mqtt_server:   			  {val: $config_store.mqtt_server, state: "", req: true},
			mqtt_port:				  {val: $config_store.mqtt_port,  state: "", req: true},
			mqtt_reject_unauthorized: {val: $config_store.mqtt_reject_unauthorized, state: "", req: false},
			mqtt_user: 				  {val: $config_store.mqtt_user, state: "", req: false},
			mqtt_pass: 				  {val: $config_store.mqtt_pass?hiddenpass:"", state: "", req: false},
			mqtt_topic: 		      {val: $config_store.mqtt_topic, state: "", req: true},
			mqtt_announce_topic:	  {val: $config_store.mqtt_announce_topic, state: "", req: false},
			mqtt_retained: 			  {val: $config_store.mqtt_retained, state: "", req: false},
			mqtt_vrms:				  {val: $config_store.mqtt_vrms, state: "", req: false}
		}	
	}

	async function toggleMQTT() {	
		let data = {
			mqtt_enabled: formdata.mqtt_enabled.val,
		}	
		let reqfields_ok = true
		if (!$config_store.mqtt_enabled) {
			for (const key of Object.keys(formdata)) {
				if (formdata[key].req) {
					if (formdata[key].val == "") {
						alert_body = $_("config.mqtt.missing-" + key)
						alert_visible = true
						formdata.mqtt_enabled.val = false
						reqfields_ok = false
						return false
					}
				}
				data[key] = formdata[key].val	
			}
		}

		if ( formdata.mqtt_pass.val && formdata.mqtt_pass.val !== hiddenpass) {
				data.mqtt_pass = formdata.mqtt_pass.val
			} else delete data.mqtt_pass

		if (!reqfields_ok)
			return false

		formdata.mqtt_enabled.state = "loading"
		if (await serialQueue.add(() => config_store.upload(data)))
		{
			formdata.mqtt_enabled.state= "ok"
			return true
		}
		else {
			formdata.mqtt_enabled.state = "error"
			return false
		}
	}

	let setProperty = async (prop) => {
		if (formdata[prop].val.length > 64)
			return false
		if (formdata.mqtt_enabled.val && formdata[prop].req && !formdata[prop].val ) {
			alert_body = $_("config.mqtt.missing-" + prop)
			alert_visible = true
			formdata[prop].val = $config_store[prop]
			return false
		}
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
						<Switch name="mqttswitch" label={formdata.mqtt_enabled.val?$_("enabled"):$_("disabled")} onChange={toggleMQTT} bind:checked={formdata.mqtt_enabled.val} disabled={formdata.mqtt_enabled.state=="loading"}/>
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
							<div class="is-inline-block">
								<div class="has-text-weight-bold">Protocol</div>
								<Select bind:value={formdata.mqtt_protocol.val} items={protocols} bind:status={formdata.mqtt_protocol.state} onChange={async ()=> { await setProperty("mqtt_protocol")}}/>
							</div>
							<InputForm is_inline title="{$_("config.mqtt.host")}*" size={16} bind:value={formdata.mqtt_server.val} placeholder="server IP / Hostname" bind:status={formdata.mqtt_server.state} onChange={()=>setProperty("mqtt_server")}/>
							<InputForm is_inline title="{$_("config.mqtt.port")}*" size={10} bind:value={formdata.mqtt_port.val} placeholder="1883" type="number" bind:status={formdata.mqtt_port.state} onChange={()=>setProperty("mqtt_port")} />
							</div>
						
						
						<div class="has-text-left mt-2">
							<Switch name="mqttselfcert" label={$_("config.mqtt.rejectselfsigned")} bind:checked={formdata.mqtt_reject_unauthorized.val} bind:status={formdata.mqtt_reject_unauthorized.state} onChange={()=>setProperty("mqtt_reject_unauthorized")}/>
						</div>
						<div class="is-flex is-justify-content-space-evenly is-flex-wrap-wrap">
							<div class="mx-1">
								<InputForm is_inline title={$_("config.mqtt.username")} size={16} bind:value={formdata.mqtt_user.val} placeholder="Username" bind:status={formdata.mqtt_user.state} onChange={()=>setProperty("mqtt_user")} />
							</div>
							<div class="mx-1">
								<InputForm is_inline title={$_("config.mqtt.password")} size={16} bind:value={formdata.mqtt_pass.val} placeholder="Password" type="password" bind:status={formdata.mqtt_pass.state} onChange={()=>setProperty("mqtt_pass")} />
							</div>
						</div>
					</Borders>
				</div>
				<div class="my-1 is-flex is-justify-content-center" >
					<Borders grow={true}>
						<div>
							<InputForm title="{$_("config.mqtt.basetopic")}*" bind:value={formdata.mqtt_topic.val} placeholder="openevse" bind:status={formdata.mqtt_topic.state} onChange={()=>setProperty("mqtt_topic")} />
						</div>
						<div class="is-size-7 mb-2">{$_("config.mqtt.basetopic-desc")}</div>
						<div>
							<InputForm title="{$_("config.mqtt.announcetopic")}" bind:value={formdata.mqtt_announce_topic.val} placeholder="openevse/announce/{$config_store.hostname}" bind:status={formdata.mqtt_announce_topic.state} onChange={()=>setProperty("mqtt_announce_topic")} />
						</div>
						<div class="is-size-7 mb-2">{$_("config.mqtt.announcetopic-desc")}</div>
						<div class="has-text-left">
							<Switch name="mqttretain" label={$_("config.mqtt.retain")} bind:checked={formdata.mqtt_retained.val} bind:status={formdata.mqtt_retained.state} onChange={()=>setProperty("mqtt_retained")} />
						</div>
						
						<div class="mt-4">
							<InputForm title={$_("config.mqtt.topic-voltage")} bind:value={formdata.mqtt_vrms.val} placeholder="topic/voltage" bind:status={formdata.mqtt_vrms.state} onChange={()=>setProperty("mqtt_vrms")} />
						</div>
						<div class="is-size-7">{$_("config.mqtt.topic-voltage-desc")}</div>
					</Borders>	
				</div>
			</form>
		</div>
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
	
</Box>
{/if}