<script>
	import { _ } 		   		  from 'svelte-i18n'
	import { serialQueue } 		  from "./../../../lib/queue.js";
	import {httpAPI, createTzObj} from '../../../lib/utils.js'
	import {status_store} 		  from "../../../lib/stores/status.js"
	import {config_store} 		  from "../../../lib/stores/config.js"
	import {onMount} 			  from "svelte"
	import { DateTime } 		  from "luxon";
	import Box 					  from "../../ui/Box.svelte"
	import InputForm 			  from "../../ui/InputForm.svelte"
	import timeZone 			  from "../../../../library/posix_tz_db/zones.json"
	import Button 				  from "../../ui/Button.svelte"
	import Select 				  from "../../ui/Select.svelte"


	let inputSntpState = 0
	let date
	let timemode = 1 // 0: manual 1: NTP
	let tz = "UTC"
	let setTimeButnState = "default"
	let selectTimeModeState = "default"
	let selectTimeZoneState = "default"
	let allow_time_update = true
	let butn_settime
	let timemodes = [
		{name: $_("config.time.manual"), value: 0},
		{name: $_("config.time.ntp"),    value: 1}
	]

	function updateDateField(t) {
		if (allow_time_update && t != undefined) {
			let zone = "UTC"
			if ($config_store.time_zone)
				zone = $config_store.time_zone.split("|")[0]
			const dt = DateTime.fromISO(t).setZone(zone)
			date = dt.toFormat("yyyy-MM-dd'T'HH:mm")
		}	
	}

	async function setNTP(server) {
		inputSntpState = 1
		let res = await serialQueue.add(() => config_store.saveParam("sntp_hostname", server))
		if (res) 
			inputSntpState = 2
		else 
			inputSntpState = 3
	}

	async function setTime() {
		const formData = new FormData();
		setTimeButnState = "loading"
		if (timemode == 0) {
			var newdate = new Date(date)		
			formData.set('ntp', 'false');
			formData.set('tz', tz);
			formData.set('time', newdate.toISOString());
		}
		else {
			formData.set('ntp', "true");
			formData.set('tz', tz);
		}
		
		// @ts-ignore
		const payload = new URLSearchParams(formData).toString()
		allow_time_update = true
		let res = await serialQueue.add(() => httpAPI("POST","/settime",payload, "text"))
		if (res == "set" )  {
			setTimeButnState = "ok"
			return true
		}
		else {
			setTimeButnState = "error"
			return false
		}
	}

	async function setTimeMode() {
		selectTimeModeState = "loading"
		butn_settime.disabled = true
		const data = {
			sntp_enabled: timemode==1?true:false,
		}
			if (await config_store.upload(data)) 
				{
					selectTimeModeState = "ok"
					allow_time_update = true
					butn_settime.disabled = false
					return true
				}
			else {
				selectTimeModeState = "error"
				butn_settime.disabled = false
				return false
			}
	}

	function getTimeMode(val) {
		if (val) timemode = 1
		else timemode = 0
	}

	async function setTimeZone() {
		selectTimeZoneState = "loading"

		const data = {time_zone: tz}
		if (await config_store.upload(data)) 
			{
				selectTimeZoneState = "ok"
				return true
			}
		else {
			selectTimeZoneState = "error"
			return false
		}
	}

	function timeNow() {
		//const localdate = DateTime().now()
		allow_time_update = false
		const localdate = DateTime.now()
		date = localdate.toFormat("yyyy-MM-dd'T'HH:mm")
		return true
	}


	onMount(() => {
		tz = $config_store.time_zone
		})

	$: getTimeMode($config_store.sntp_enabled)
	$: $status_store.time, updateDateField($status_store.time)
	$: $config_store.time_zone, ()=> {tz = $config_store.time_zone }
</script>

<Box title={$_("config.titles.time")} icon="fa6-solid:clock" back={true}>

	<InputForm type="datetime-local" title="{$_("config.time.date")}:" placeholder="" bind:value={date} disabled={timemode==0?false:true} onFocus={() => {allow_time_update = false}} />
	{#if !timemode}
	<div><Button name={$_("config.time.usebrowsertime")} butn_submit={timeNow}/></div>
	{:else}
	<div>
		<InputForm type="text" title="{$_("config.time.ntpserver")}:" placeholder={$_("config.time.ntpserver-desc")}  bind:value={$config_store.sntp_hostname} 
			status={inputSntpState} onChange={() => {setNTP($config_store.sntp_hostname)}}/>
	</div>
	{/if}
	<Select title="{$_("config.time.settimefrom")}:" status={selectTimeModeState} bind:value={timemode} items={timemodes} onChange={setTimeMode} />

	<div class="select-tz">
		<Select title="{$_("config.time.timezone")}:" status={selectTimeZoneState} bind:value={tz} items={createTzObj(timeZone)} onChange={setTimeZone} />

	</div>
	<div class="mt-4 mb-1">
		<Button name={$_("config.time.settime")} butn_submit={setTime} bind:this={butn_settime} bind:state={setTimeButnState}/>
	</div>
</Box>
