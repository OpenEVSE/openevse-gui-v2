<script>
	export let title = "Error";
	export let body;
	export let visible = false;

	function close() {
		visible = false;
	}
</script>

{#if visible == true}
<div id="t_modal" class="modal is-active">
	<div class="modal-background"></div>
	<div class="modal-content p-3">
		<article class="message is-danger">
			<div class="message-header">
			<p>{title}</p>
			<button class="delete" aria-label="delete" on:click={close}></button>
			</div>
			<div class="message-body">
				{body}
			</div>
		</article>
	</div>
</div>
{/if}