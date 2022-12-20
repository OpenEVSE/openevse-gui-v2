<script>
	export let title = "Error";
	export let body;
	export let visible = false;
	export let button = false
	export let label = ""
	export let closable = true;
	export let action = () => {}

	function close() {
		if (closable)
			visible = false;
	}
</script>

{#if visible == true}
<div id="t_modal" class="modal is-active">
	<div class="modal-background" on:click={close} on:keydown={close}></div>
	<div class="modal-content p-3">
		<article class="message is-danger">
			<div class="message-header">
			<p>{title}</p>
			{#if closable}
			<button class="delete" aria-label="delete" on:click={close}></button>
			{/if}
			</div>
			<div class="message-body">
				{body}
			</div>
			{#if button}
			<div class="is-flex is-justify-content-center">
				<button class="button is-danger is-outlined my-3" on:click={action}>{label}</button>
			</div>
			{/if}
		</article>
	</div>
</div>
{/if}