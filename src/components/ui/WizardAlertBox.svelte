<script>
	import { config_store } from "./../../lib/stores/config.js";
	import { _ } from 'svelte-i18n'
	let url
	function copy2cb() {
		// let uri = window.getSelection().selectAllChildren(url);


		var range = document.createRange();
		range.selectNode(url);
		window.getSelection().removeAllRanges(); // clear current selection
		window.getSelection().addRange(range); // to select text
		// document.execCommand("copy");
		let selection = window.getSelection().toString();
		// Copy the text inside the text field
		navigator.clipboard.writeText(selection);
		window.getSelection().removeAllRanges();// to deselect
	}
</script>
<div class="my-4">
	<div class="mb-2">
		{$_("wizard-reload")}
		<a bind:this={url} href={null} on:click|preventDefault={copy2cb}>http://{$config_store.hostname}.local</a>
	</div>
	
	<div>
		{$_("wizard-reload2")}
	</div>
</div>
