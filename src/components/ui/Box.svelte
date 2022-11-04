<script>
	export let title = "title"
</script>

<style>
</style>
<div class="box is-unselectable pt-3">	
	<div class="is-size-5 has-text-weight-bold mb-1">{title}</div>
		<div class="container">	
		<slot>
		</slot>
	</div>
</div>