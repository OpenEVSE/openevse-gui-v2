<script>
	export let title;
	export let body;
	export let visible = false;

</script>
<style>

</style>
{#if visible == true}
<div class="container is-flex-grow-0" style="width: 100%;">
	<div class="columns is-mobile is-centered p-0 m-0" >
		<div class="column is-three-quarters-tablet is-two-thirds-desktop pb-0 mb-0">
				<div class="message is-danger">
					<div class="message-header">
						<p>{title}</p>
					</div>
					<div class="message-body has-text-centered ">
						{body}
					</div>
				</div>
		</div>
	</div>
</div>
{/if}