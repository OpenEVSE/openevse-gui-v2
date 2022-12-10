<script>
	import Box from "./../components/ui/Box.svelte";
	import { link } from "svelte-spa-router";
	import Status from "../components/blocks/Status.svelte";
	export const params = {}; 
</script>
<style>
</style>

<Box title="404 error">
	<span class="is-size-6">The link you are looking for do not exist.</span>
	<a href="/" on:click|preventDefault={()=>history.back()}>
		<u>Get back</u>
	</a>
</Box>



