<script>
	export let title = "title"
</script>

<style>
</style>
<div class="is-unselectable box ">	
	<div class="mb-2 is-size-5 has-text-weight-bold">{title}</div>
		<div class="container">	
		<slot>
		</slot>
	</div>
</div>