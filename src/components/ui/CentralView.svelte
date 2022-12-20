<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
</script>
<style>
	.columns {
		height: 100%;
	}
</style>

<div class="columns is-mobile is-centered p-0 m-0" >
	<div class="column is-two-thirds-tablet">
			<slot>
			</slot>
	</div>
</div>