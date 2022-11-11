<script>
	import Box from "../../ui/Box.svelte"
	import {status_store} from "../../../lib/stores/status.js"
	import {config_store} from "../../../lib/stores/config.js"
	import InputForm from "../../ui/InputForm.svelte"
	import {httpAPI} from '../../../lib/utils.js'
	import timeZone from "../../../../library/posix_tz_db/zones.json"
	import {onMount} from "svelte"
	import Button from "../../ui/Button.svelte"
	import Select from "../../ui/Select.svelte"

	let input_ntp_status = 0
	let date
	let timemode = 1 // 0: manual 1: NTP
	let tz
	let setTimeButnState = "default"
	let selectTimeModeState = "default"
	let selectTimeZoneState = "default"
	let time_modal_opened = false

	let timemodes = [
		{name: "Manual", value: 0},
		{name: "NTP",    value: 1}
	]

	async function setConf(prop,val) {
		input_ntp_status = 1 //loading
		let res = await config_store.setConfig(prop, val)
		if (res.msg == "done" || res.msg =="no change") {
			input_ntp_status = 2 //ok
		}
		else input_ntp_status = 3 //error
		return res
	}

	function getDate(t) {
			const evsedate = new Date(t)
			date = new Date(evsedate.getTime() - evsedate.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
			console.log("get date: " + date)
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
		let res = await httpAPI("POST","/settime",payload, "text")
		if (res == "set" )  {
			setTimeButnState = "ok"
			getDate($status_store.time)
			return true
		}
		else {
			setTimeButnState = "error"
			return false
		}
	}

	async function setTimeMode() {
		selectTimeModeState = "loading"

		const data = {
			sntp_enabled: timemode==1?true:false,
		}
			if (await config_store.upload(data)) 
				{
					selectTimeModeState = "ok"
					console.log("timemode=" +timemode)
					if (timemode==1) { setTime() }
					return true
				}
			else {
				selectTimeModeState = "error"
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

	function create_tz_obj(tz) {
		if (tz) {
			var tzobj = []
			Object.entries(tz).forEach((element,index,array) => {
				tzobj[index] = {name: element[0], value: element[0] + "|" + element[1]}
			})
			return tzobj
		}
	}

	onMount(() => {
		tz = $config_store.time_zone
		getDate($status_store.time)
		getTimeMode($config_store.sntp_enabled) 
		})

	$: getTimeMode($config_store.sntp_enabled) 

</script>

<Box title="Time">

	<InputForm type="datetime-local" title="Date" placeholder="" bind:value={date} disabled={timemode==0?false:true} />
	<Select title="Set time from:" status={selectTimeModeState} bind:value={timemode} items={timemodes} onChange={setTimeMode} />
	
	{#if timemode}
	<InputForm type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		status={input_ntp_status} onChange={()=>setConf("sntp_hostname", $config_store.sntp_hostname)}/>
	{:else}
	<!-- <Button name="Use Current Time" butn_submit={timeNow}/> -->
	<div class="mt-4">
		<Button name="Set Time" butn_submit={setTime} bind:state={setTimeButnState}/>
	</div>
	{/if}
	<div class="">
		<Select title="Time zone:" status={selectTimeZoneState} bind:value={tz} items={create_tz_obj(timeZone)} onChange={setTimeZone} />

	</div>
</Box>
