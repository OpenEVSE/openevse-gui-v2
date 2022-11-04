<script>
	import {round} from "../../lib/utils.js"
	export let title
	export let value
	export let unit = ""
	export let precision = 0

</script>
<style>
		.tiles {
		max-width : 200px;
		min-width : 80px;
		flex: 1 0 21%;
	}
</style>
<div class="box has-text-centered mx-2 mb-2 px-1 py-2 tiles">
	<div>
		<p class="heading has-text-weight-semibold">{title}</p>
		<p class="is-size-5 is-size-6-mobile has-text-weight-bold">{typeof(value) == "number"?round(value,precision):value} {unit}</p>
	</div>
</div>