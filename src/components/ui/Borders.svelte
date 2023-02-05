
<script>
	import Help 			 	from "./Help.svelte"
	export let grow = false
	export let has_help = false
	export let classes = ""
</script>
<style>
	.borders {
		position: relative;
		border-radius: 10px;
		border: 1px solid rgb(50, 179, 212);
		max-width: 90%;
		min-width: 200px;
		height:fit-content;
		box-sizing: content-box;
	}

	.help {
		position: absolute;
		right: 7px;
		top: 7px;
		background-color: white;

	}

</style>

<div class="borders my-2 p-2 has-text-centered {classes} {grow?"is-flex-grow-1 is-flex-shrink-0":"is-flex-shrink-0"}">
	<div class:is-hidden={!has_help} class="help m-0 p-0">
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<slot>
	</slot>
</div>