<script>
import {status_store} from "../../lib/stores/status.js"
import {config_store} from "../../lib/stores/config.js"
import InputFormMini from "../ui/InputFormMini.svelte"
import {utc2evseLocalTime} from "../../lib/utils.js"
import {httpAPI} from '../../lib/utils.js'
import timeZone from "../../../library/posix_tz_db/zones.json"
import {onMount} from "svelte"

let input_ntp_status = 0
let date
let timemode = 1
let tz


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
	
	const payload = new URLSearchParams(formData)
	let res = await httpAPI("POST","/settime",payload, "text")
	if (res.error) return false
	else return true
}

onMount(() => {tz = $config_store.time_zone})


$: formatDate($status_store.time,$config_store.time_zone)

</script>
<style>
	.box {
		max-width : 600px;
		min-width: 300px;
	}
</style>

<div class="box is-flex-grow-1 is-flex-shrink-0 mx-2">
	<div class="has-text-weight-bold is-size-5 mb-5">Time</div>
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
		<div class="mt-4"><button class="button is-outlined is-info" on:click={setTime}>Set Time</button></div>
	</div>
</div>