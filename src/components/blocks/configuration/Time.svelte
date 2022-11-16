<script>
	import { fetchQueue } from "./../../../lib/fetchQueue.js";
	import Box from "../../ui/Box.svelte"
	import {status_store} from "../../../lib/stores/status.js"
	import {config_store} from "../../../lib/stores/config.js"
	import InputForm from "../../ui/InputForm.svelte"
	import {httpAPI, createTzObj, formatDate, getTZ} from '../../../lib/utils.js'
	import timeZone from "../../../../library/posix_tz_db/zones.json"
	import {onMount} from "svelte"
	import Button from "../../ui/Button.svelte"
	import Select from "../../ui/Select.svelte"
	import { DateTime } from "luxon";

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
		{name: "Manual", value: 0},
		{name: "NTP",    value: 1}
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
		let res = fetchQueue.add(config_store.saveParam("sntp_hostname", server))
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
		let res = await httpAPI("POST","/settime",payload, "text")
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
	$: updateDateField($status_store.time)
	$: $config_store.time_zone, ()=> {tz = $config_store.time_zone }
</script>

<Box title="Time">

	<InputForm type="datetime-local" title="Date" placeholder="" bind:value={date} disabled={timemode==0?false:true} onFocus={() => {allow_time_update = false}} />
	{#if !timemode}
	<div><Button name="Use Browser Time" butn_submit={timeNow}/></div>
	{:else}
	<InputForm type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		status={inputSntpState} onChange={() => {setNTP($config_store.sntp_hostname)}}/>
	{/if}
	<Select title="Set time from:" status={selectTimeModeState} bind:value={timemode} items={timemodes} onChange={setTimeMode} />
	<div class="mt-4">
		<Button name="Set Time" butn_submit={setTime} bind:this={butn_settime} bind:state={setTimeButnState}/>
	</div>
	<div class="">
		<Select title="Time zone:" status={selectTimeZoneState} bind:value={tz} items={createTzObj(timeZone)} onChange={setTimeZone} />

	</div>
</Box>
