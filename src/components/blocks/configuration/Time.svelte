<script>
	import { uisettings_store } from "./../../../lib/stores/uisettings.js";
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


	let inputSntpState = ""
	let date
	let timemode = 2 // 0: manual, 1: Browser, 2: NTP
	let tz = ""
	let setTimeButnState = ""
	let selectTimeModeState = ""
	let selectTimeZoneState = ""
	let allow_time_update = true
	let butn_settime
	let timemodes = [
		{name: $_("config.time.manual"), value: 0},
		{name: $_("config.time.ntp"),    value: 2}
	]

	function updateDateField(t) {
		if (allow_time_update && t != undefined) {
			date = t.slice(0,16)
			console.log(date)
		}	
	}

	async function setNTP(server) {
		inputSntpState = "loading"
		let res = await serialQueue.add(() => config_store.saveParam("sntp_hostname", server))
		if (res) 
			inputSntpState = "ok"
		else 
			inputSntpState = "error"
		setTimeout(() => {
			inputSntpState = ""
		}, 2000);
	}

	async function setTime(loader=true) {
		let data = { 
			sntp_enabled: true,
			time: undefined,
			time_zone: undefined
		}

		// const formData = new FormData();
		setTimeButnState = loader?"loading":""
		if (timemode == 0 || timemode == 1) {

			const zone = $config_store.time_zone.split("|")[0]
			var newdate = DateTime.fromISO(date).toUTC()
			data.sntp_enabled = false
			data.time_zone = tz
			data.time = newdate
		}
		else {
			data.sntp_enabled = true
			data.time_zone = tz
		}
		allow_time_update = true
		let res = await serialQueue.add(() => httpAPI("POST","/time",JSON.stringify(data)))
		if (res.msg == "done" )  {
			setTimeButnState = loader?"ok":""
			return true
		}
		else {
			setTimeButnState = loader?"error":""
			return false
		}
	}

	async function setTimeMode() {
		selectTimeModeState = "loading"
		if (butn_settime)
			butn_settime.disabled = true
		const data = {
			sntp_enabled: timemode==2?true:false,
		}
		data.time_zone = tz
		if (await config_store.upload(data)) 
			{
				selectTimeModeState = "ok"
				allow_time_update = true
				if (timemode != 2) {
					timeNow()
					setTime(false)
				}
				else {
					setTime(false)
				}
				
				if (butn_settime)
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
		if (val) timemode = 2
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
		allow_time_update = false
		date = DateTime.now().toString().slice(0,16)

		return true
	}

	onMount(() => {
		tz = $config_store.time_zone
		getTimeMode($config_store.sntp_enabled)
		// get tz from browser
		if (!tz) {
			let tzshort = Intl.DateTimeFormat().resolvedOptions().timeZone
			tz = createTzObj(timeZone).filter(function(el){return el.name == tzshort})[0].value
			setTimeZone()
		}	
	})

	$: $status_store.time, updateDateField($status_store.local_time)
	$: $config_store.time_zone, ()=> {tz = $config_store.time_zone }
</script>

<Box title={$_("config.titles.time")} icon="fa6-solid:clock" back={true}>
	<div class="is-flex is-flex-direction-column is-align-items-center">
		<div class="is-flex is-flex-direction-column is-align-items-start">
			
				<InputForm type="datetime-local" title="{$_("config.time.date")}:" placeholder="" bind:value={date} disabled={timemode==0?false:true} onFocus={() => {allow_time_update = false}} />
				{#if timemode == 0}
				<div class="is-flex is-flex-direction-row is-flex-wrap-wrap">
					<div class="mb-1 is-inline-block">
						<Button name={$_("config.time.usebrowsertime")} butn_submit={()=>{timeNow()}} />
					</div>
					<div class="mb-1 is-inline-block">
						<Button name={$_("config.time.settime")} color="is-primary" butn_submit={setTime} bind:this={butn_settime} bind:state={setTimeButnState}/>
					</div>
				</div>
				{/if}
			{#if timemode == 2}
			<InputForm type="text" title="{$_("config.time.ntpserver")}:" placeholder={$_("config.time.ntpserver-desc")}  bind:value={$config_store.sntp_hostname} 
				status={inputSntpState} onChange={() => {setNTP($config_store.sntp_hostname)}}/>
			{/if}
			<Select title="{$_("config.time.settimefrom")}:" status={selectTimeModeState} bind:value={timemode} items={timemodes} onChange={setTimeMode} />
			<!-- {#if timemode==2} -->
			{#if true}
			<Select title="{$_("config.time.timezone")}:" status={selectTimeZoneState} bind:value={tz} items={createTzObj(timeZone)} onChange={setTimeZone} />
			{/if}
		</div>
	</div>
	
</Box>
