<script>
	import { config_store } 	from "./../lib/stores/config.js";
	import { uistates_store } 	from "./../lib/stores/uistates.js";
	import { status_store } 	from "./../lib/stores/status.js";
	import { onMount } 			from "svelte";
	import {replace}			from 'svelte-spa-router'
	import CentralView 			from "./../components/ui/CentralView.svelte";
	import Manual 				from "./../components/blocks/main/Manual.svelte"

	onMount(()=> {
		if ($status_store.mode == "AP" || ($uistates_store.mode == "STA+AP" && !$config_store.ssid)) {
			replace('/wizard')
		}
	})
</script>


<CentralView>
	<Manual />
</CentralView>
