<script>
	import Box from "../../ui/Box.svelte"
	import TimeModal from "./TimeModal.svelte"
	import {status_store} from "../../../lib/stores/status.js"
	import {config_store} from "../../../lib/stores/config.js"
	import InputForm from "../../ui/InputForm.svelte"
	import {utc2evseLocalTime} from "../../../lib/utils.js"
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
			const utctime = new Date(t)
			date = utctime
		}

	async function setTime() {
		const formData = new FormData();
		setTimeButnState = "loading"
		if (timemode == 0) {
			
			// var dateSplit = date.split(" ")
			// var dateParts = dateSplit[0].split("/");
			// const newdate = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2] + " " + dateSplit[1] )
			// const isodate = newdate.toISOString()
			const isodate = date.toISOString()
			formData.set('ntp', 'false');
			formData.set('tz', tz);
			formData.set('time', isodate);
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
			return true
		}
		else {
			setTimeButnState = "error"
			return false
		}
	}

	async function setTimeMode() {
		console.log("Set timemode")
		selectTimeModeState = "loading"

		const data = {sntp_enabled: timemode==0?false:true}
			if (await config_store.upload(data)) 
				{
					selectTimeModeState = "ok"
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

	function timeNow() {
		const localdate = new Date()
		//date = utc2evseLocalTime(localdate, tz, true)
		date = localdate
		time_modal_opened = false
		return true
	}

	function setTimeZone() {

	}

	onMount(() => {
		tz = $config_store.time_zone
		getDate($status_store.time)
		getTimeMode($config_store.sntp_enabled) 
		})


	function displayDate(date) {
		if(date)
			return utc2evseLocalTime(date,tz,true)
		else return 0
	}

	$: getTimeMode($config_store.sntp_enabled) 

</script>

<Box title="Time">
	{#key timemode}
	<InputForm type="text" title="Local Time" placeholder="date" value={displayDate(date)} disabled={timemode==0?false:true} onFocus={()=> time_modal_opened = true }  />
	{/key}
	<Select title="Set time from:" status={selectTimeModeState} bind:value={timemode} items={timemodes} onChange={setTimeMode} />
	
	{#if timemode}
	<InputForm type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		status={input_ntp_status} onChange={()=>setConf("sntp_hostname", $config_store.sntp_hostname)}/>
	{:else}
	<!-- <Button name="Use Current Time" butn_submit={timeNow}/> -->
	{/if}
	<div class="">
		<!-- <Select title="Time zone:" status={selectTimeZoneState} bind:value={tz} items={Object.entries(timeZone)} onChange={setTimeZone} /> -->
		<div class="has-text-weight-bold">Time zone:</div>
		<div class="select is-info">		
			<select bind:value={tz} disabled={false}>
				{#each Object.entries(timeZone) as option,i}
				<option value={option[0]+"|"+option[1]}>{option[0]}</option>
				{/each}	
			</select>
		</div>

		<div class="mt-4">
			<Button name="Set Time" butn_submit={setTime} bind:state={setTimeButnState}/>
		</div>
	</div>
</Box>
{#if time_modal_opened}
<TimeModal bind:is_opened={time_modal_opened} bind:value={date} timeNow={timeNow}/>
{/if}