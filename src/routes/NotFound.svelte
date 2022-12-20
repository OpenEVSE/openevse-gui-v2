<script>
	import CentralView	from "./../components/ui/CentralView.svelte";
	import Box 			from "./../components/ui/Box.svelte";
	export const params = {}; 
</script>

<CentralView>
	<Box title="404 error">
		<span class="is-size-6">The link you are looking for do not exist.</span>
		<a href="/" on:click|preventDefault={()=>history.back()}>
			<u>Get back</u>
		</a>
	</Box>
	
</CentralView>



