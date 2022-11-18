<script>
	import Http from "../components/blocks/configuration/Http.svelte"
	import Status from "../components/blocks/Status.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>

<div class="container px-3">
	<Status />
	<!-- <Breadcrumb /> -->
	<div class="columns">
		<div class="column">
			<Http />
		</div>
		<div class="column">
			<!-- content -->
		</div>
	</div>
</div>