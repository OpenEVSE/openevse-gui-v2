<script>
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import Modal from "./Modal.svelte"
	import {_} from "svelte-i18n"
	export let title
	export let body = null;
	export let component = null
	export let visible = false;
	export let button = false
	export let label = "OK"
	export let closable = true;
	export let action = () => {}

	function close() {
		if (closable) {
			visible = false;
			uistates_store.resetAlertBox()
		}
			
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
				{#if body}
				{@html body}
				{/if}
				{#if component}
				<svelte:component this={component} />
				{/if}
			</div>
			{#if button}
			<div class="is-flex is-justify-content-center">
				<button class="button is-danger is-outlined my-3" on:click={action}>{label}</button>
			</div>
			{/if}
		</article>
</Modal>
{/if}