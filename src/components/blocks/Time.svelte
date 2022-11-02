<script>
import {status_store} from "../../lib/stores/status.js"
import {config_store} from "../../lib/stores/config.js"
import InputFormMini from "../ui/InputFormMini.svelte"
import {utc2evseLocalTime} from "../../lib/utils.js"


let input_ntp_status = 0
let date


async function onChange(prop,val,e) {
	//e.stopPropagation()
	console.log(e)
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

function setTime(d) {
	const newdate = new Date(d)
	console.log("date: " + newdate)

}

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
	<InputFormMini type="text" isDate={true} title="Local Time" placeholder="date" bind:value={date} disabled={true} 
		onChange={()=>onChange(setTime(date))}/>
	<InputFormMini type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		status={input_ntp_status} onChange={()=>onChange("sntp_hostname", $config_store.sntp_hostname)}/>
</div>