<script>
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./lib/routes.js";
	import FetchData from './components/data/FetchData.svelte'
	
</script>



<main>
	
	<Header />
	<FetchData />
	<Router {routes}/>
</main>


