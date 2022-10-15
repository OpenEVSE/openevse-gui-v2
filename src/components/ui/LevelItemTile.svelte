<script>
	export let title
	export let value
	export let unit = ""
</script>
<style>
		.tiles {
		max-width : 200px;
		margin: auto;
	}
</style>
<div class="box level-item has-text-centered py-2 px-0 tiles">
	<div>
		<p class="heading has-text-weight-semibold">{title}</p>
		<p class="is-size-5 is-size-6-mobile has-text-weight-bold">{value} {unit}</p>
	</div>
</div>