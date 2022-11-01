<script>
import {status_store} from "../../lib/stores/status.js"
import {config_store} from "../../lib/stores/config.js"
import InputFormMini from "../ui/InputFormMini.svelte"
async function onChange(prop,val) {
	config_store.setConfig(prop, val)
}
</script>
<style>
	.box {
		max-width : 600px;
		min-width: 300px;
	}
</style>

<div class="box is-flex-grow-1 is-flex-shrink-0 mx-2">
	<div class="has-text-weight-bold is-size-5 mb-5">Time</div>
	<InputFormMini type="text" title="NTP Server" placeholder="NTP host name" bind:value={$config_store.sntp_hostname} 
		onChange={()=>onChange("sntp_hostname", $config_store.sntp_hostname)}/>
</div>