<script>
	import {round, isFloat} from "../../lib/utils.js"
	export let title
	export let value
	export let unit = undefined
	export let precision = 0
	export let visible = true

</script>
<style>
		.tiles {
		max-width : 200px;
		min-width : 80px;
		flex: 1 0 21%;
	}
</style>
<div class="box has-text-centered mx-2 mb-2 px-1 py-1 tiles has-background-dark has-text-white" class:is-hidden={!visible}>

		<p class="heading has-text-weight-semibold has-text-primary">{title}</p>
		<p class="is-size-5 is-size-6-mobile has-text-weight-bold">{typeof(value) == "number"?isFloat(value)?round(value,precision).toFixed(1):value:value} {unit?unit:""}</p>
	
</div>