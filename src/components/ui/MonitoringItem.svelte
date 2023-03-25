<script>
	export let name
	export let value
	export let unit = ""
</script>
<style>
	.tag {
		box-sizing: border-box;
		width: 100%;
		font-size: medium;
	}
	.name {
		width: 70%;
	}
	.val {
		width: 28%;
	}
</style>
<div>
	<div class="is-flex is-justify-content-space-between is-align-items-center px-2 py-2">
		<span class="name is-size-7-mobile">{name}</span>
		<span class="val tag is-normal is-dark is-size-7-mobile">{value} {unit}</span>
	</div>
</div>