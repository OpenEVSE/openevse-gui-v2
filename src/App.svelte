<script>
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./lib/routes.js";
	import FetchData from './components/data/FetchData.svelte'
	import {uistates_store} from './lib/stores/uistates.js'
	import WebSocket from "./components/data/WebSocket.svelte"
</script>



<main>
	<WebSocket/>
	<Header />
	<FetchData />
	{#if $uistates_store.data_loaded}
	<Router {routes}/>
	{/if}
</main>


