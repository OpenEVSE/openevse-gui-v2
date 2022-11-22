<script>
	import { link } from "svelte-spa-router";
	import Status from "../components/blocks/Status.svelte";
	export const params = {}; 
</script>
<style>
</style>

<div class="box">
	<div class="is-size-3 has-text-weight-bold">404 error</div>
	<span class="is-size-6">The link you are looking for do not exist.</span>
	<a href="/" use:link>
		<h5>Take me home →</h5>
	</a>
</div>



