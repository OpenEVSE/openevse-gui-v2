<script>
	import Modal from "./Modal.svelte"
	import {_} from "svelte-i18n"
	export let title = $_("error");
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
<Modal bind:is_opened={visible} canClose={closable}>
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
</Modal>
{/if}