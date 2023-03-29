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
{#if  visible}
<div class="box has-text-centered mx-2 mb-2 px-1 py-1 tiles has-background-info-dark has-text-white">

		<p class="heading has-text-weight-semibold has-text-primary">{title}</p>
		<p class="is-size-5 is-size-6-mobile has-text-weight-bold">{typeof(value) == "number"?isFloat(value)?round(value,precision).toFixed(precision):value:value} {unit?unit:""}</p>
	
</div>
{/if}