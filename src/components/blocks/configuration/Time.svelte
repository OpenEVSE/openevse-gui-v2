<script>
import Box from "../../ui/Box.svelte"
import TimeModal from "./TimeModal.svelte"
import {status_store} from "../../../lib/stores/status.js"
import {config_store} from "../../../lib/stores/config.js"
import InputFormMini from "../../ui/InputFormMini.svelte"
import {utc2evseLocalTime} from "../../../lib/utils.js"
import {httpAPI} from '../../../lib/utils.js'
import timeZone from "../../../../library/posix_tz_db/zones.json"
import {onMount} from "svelte"
import Button from "../../ui/Button.svelte"

let input_ntp_status = 0
let date
let timemode = 1 // 0: manual 1: NTP
let tz
let setTimeButnState = ""
let time_modal_opened = false

async function setConf(prop,val) {
	input_ntp_status = 1 //loading
	let res = await config_store.setConfig(prop, val)
	if (res.msg == "done" || res.msg =="no change") {
		input_ntp_status = 2 //ok
	}
	else input_ntp_status = 3 //error
	return res
}

function formatDate(t,z) {
		const utctime = new Date(t)
		date = utc2evseLocalTime(utctime, z, true)
	}

async function setTime() {
	const formData = new FormData();
	setTimeButnState = "loading"
	if (timemode == 0) {
		
		var dateSplit = date.split(" ")
		var dateParts = dateSplit[0].split("/");
		const newdate = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2] + " " + dateSplit[1] )
		const isodate = newdate.toISOString()
		formData.set('ntp', "false");
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
		setTimeout(() => {
			setTimeButnState = ""
				}, 1000);
		return true
	}
	else {
		setTimeButnState = "error"
		setTimeout(() => {
			setTimeButnState = ""
				}, 1000);
		return false
	}
}

function timeNow() {
	// To Do: set to browser local time
	const localdate = new Date()
	date = utc2evseLocalTime(localdate, tz, true)
	return true

}

onMount(() => {tz = $config_store.time_zone})


$: formatDate($status_store.time,$config_store.time_zone)

</script>

<Box title="Time">
	{#key timemode}
	<!-- <InputFormMini type="text" isDate={true} title="Local Time" placeholder="date" bind:value={date} disabled={timemode==0?false:true} /> -->
	<InputFormMini type="text" title="Local Time" placeholder="date" bind:value={date} disabled={timemode==0?false:true} onFocus={()=> time_modal_opened = true }  />
	{/key}
	<div class="has-text-weight-bold">Set Time from:</div>
	<div class="select is-info">
		<select bind:value={timemode}>
			<option value={1}>NTP</option>
			<option value={0}>Manual</option>
		</select>
	</div>

	
	{#if timemode}
	<InputFormMini type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		status={input_ntp_status} onChange={()=>setConf("sntp_hostname", $config_store.sntp_hostname)}/>
	{:else}
	<Button name="Use Current Time" butn_submit={timeNow}/>
	{/if}
	<div class="">
		<div class="has-text-weight-bold">Time zone:</div>
		<div class="select is-info">		
			<select bind:value={tz} disabled={false}>
				{#each Object.entries(timeZone) as option,i}
				<option value={option[0]+"|"+option[1]}>{option[0]}</option>
				{/each}	
			</select>
		</div>
		<div class="mt-4"><Button name="Set Time" butn_submit={setTime} state={setTimeButnState}/></div>
	</div>
</Box>
{#if time_modal_opened}
<TimeModal bind:is_opened={time_modal_opened} bind:value={date}/>
{/if}