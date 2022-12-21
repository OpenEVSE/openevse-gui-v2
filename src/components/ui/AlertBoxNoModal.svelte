<script>
	export let title = "Error";
	export let body;
	export let visible = false;

</script>
<style>

</style>
{#if visible == true}
<div class="columns is-mobile is-centered p-0 m-0" >
	<div class="column is-two-thirds-tablet">
		<div class="container">
			<article class="message is-danger">
				<div class="message-header">
					<p>{title}</p>
				</div>
				<div class="message-body has-text-centered">
					{body}
				</div>
			</article>
		</div>
	</div>
</div>
{/if}