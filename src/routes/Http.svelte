<script>
	import Auth from "../components/blocks/configuration/Auth.svelte";
	import Status from "../components/blocks/Status.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>

<div class="container px-3">
	<Status />
	<Breadcrumb />
	<div class="columns">
		<div class="column">
			<Auth />
		</div>
		<div class="column">
			<!-- content -->
		</div>
	</div>
</div>