<script>
	import { status_store } from "./../../lib/stores/status.js";
	import { config_store }   from "./../../lib/stores/config.js";
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import {push} 			  from 'svelte-spa-router'
	import {reload2hostname, httpAPI}  from '../../lib/utils.js'
	import { _ } 			  from 'svelte-i18n'
	import AlertBody		  from  './WizardAlertBox.svelte'

	export let step


	function goNext() {
		step +=  1
		push('/wizard/' + step)
	}

	function goPrev() {
		step -= 1
		push('/wizard/' + step)
	}
	function quit() {
		$uistates_store.wizard_step = 0
		if ($status_store.ipaddress == "192.168.4.1") {
			$uistates_store.alertbox.title = $_("notification")
			// $uistates_store.alertbox.body = $_("wizard-reload") + "<a href='#'>http://" + $config_store.hostname + ".local" + "</a>"
			// $uistates_store.alertbox.body += "<br>" + $_("wizard-reload2") + "<br>"
			$uistates_store.alertbox.component = AlertBody
			$uistates_store.alertbox.visible = true
			$uistates_store.alertbox.button = true
			$uistates_store.alertbox.closable = false
			$uistates_store.alertbox.action = () => { 
				httpAPI("GET","/apoff",null,"text")
				uistates_store.resetAlertBox()
				setTimeout(() => {
					reload2hostname()
				}, 6000);
			}
		}
		else 
			window.location.href = "http://" + $status_store.ipaddress
	}

</script>

<div class="is-flex is-justify-content-center my-3">
	{#if step > 0}
	<button class="button is-white mr-4" on:click={goPrev}>
		<iconify-icon class="is-size-5" icon="material-symbols:navigate-before"></iconify-icon> 
		Previous &nbsp;
	</button>
	{/if}
	{#if step < 4}
	<button class="button is-white ml-4" on:click={goNext}>
		&nbsp; Next
		<iconify-icon class="is-size-5" icon="material-symbols:navigate-next"></iconify-icon> 
	</button>
	{/if}
	{#if step == 4}
	<button class="button is-white ml-4"on:click={quit}>
		&nbsp; Quit Wizard &nbsp;
	</button>
	{/if}
</div>