<script>
	import { uisettings_store } from "./../../lib/stores/uisettings.js";
	import { status_store } 	from "./../../lib/stores/status.js";
	import { uistates_store } 	from "./../../lib/stores/uistates.js";
	import {push} 			  	from 'svelte-spa-router'
	import {reload2ip, httpAPI} from '../../lib/utils.js'
	import { _ } 			  	from 'svelte-i18n'
	import AlertBody		  	from  './WizardAlertBox.svelte'

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
		// save to local storage until we have a flag on fw side
		$uisettings_store.wizard_done = true
		if ($status_store.ipaddress == "192.168.4.1") {
			$uistates_store.alertbox.title = $_("notification")
			$uistates_store.alertbox.component = AlertBody
			$uistates_store.alertbox.visible = true
			$uistates_store.alertbox.button = true
			$uistates_store.alertbox.closable = false
			$uistates_store.alertbox.action = () => { 
				uistates_store.resetAlertBox()
				setTimeout(() => {
					reload2ip()
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