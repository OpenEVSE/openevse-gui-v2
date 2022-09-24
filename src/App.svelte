<script>
	import Header from './components/blocks/Header.svelte';
	import Router from 'svelte-spa-router';
	import { routes } from "./routes.js";
</script>

<main>
	<Header />
	<Router {routes}/>
</main>


