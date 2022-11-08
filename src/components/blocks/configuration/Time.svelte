<script>
import Box from "../../ui/Box.svelte"
import {status_store} from "../../../lib/stores/status.js"
import {config_store} from "../../../lib/stores/config.js"
import InputFormMini from "../../ui/InputFormMini.svelte"
import {utc2evseLocalTime} from "../../../lib/utils.js"
import {httpAPI} from '../../../lib/utils.js'
import timeZone from "../../../../library/posix_tz_db/zones.json"
import {onMount} from "svelte"
import ButtonFetch from "../../ui/Button.svelte"

let input_ntp_status = 0
let date
let timemode = 1 // 0: manual 1: NTP
let tz
let setTimeButnState = ""

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
		
		const newdate = new Date(date)
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
	console.log(date)
	return true

}

onMount(() => {tz = $config_store.time_zone})


$: formatDate($status_store.time,$config_store.time_zone)

</script>

<Box title="Time">
	{#key timemode}
	<InputFormMini type="text" isDate={true} title="Local Time" placeholder="date" bind:value={date} disabled={timemode==0?false:true} />
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
	<button class="button is-info is-outlined mx-2" on:click={timeNow}>Use Current Time</button>
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
		<div class="mt-4"><ButtonFetch name="Set Time" butn_submit={setTime} state={setTimeButnState}/></div>
	</div>
</Box>