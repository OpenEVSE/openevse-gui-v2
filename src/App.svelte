<script>
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./lib/routes.js";
	import FetchData from './components/data/FetchData.svelte'
	import {states_store} from './lib/stores/states.js'
	
</script>



<main>
	
	<Header />
	<FetchData />
	{#if $states_store.data.loaded}
	<Router {routes}/>
	{/if}
</main>


