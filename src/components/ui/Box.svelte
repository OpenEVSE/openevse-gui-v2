<script>
	import Help from "./Help.svelte";
	import { scale, fade} from 'svelte/transition';
	import { expoOut, expoInOut } from 'svelte/easing';
	export let title = "title"
	export let has_help = false
	export let help_body = null
</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 10px;
	}
</style>

<div class="box mt-2 mb-0 pt-3"  in:scale="{{ delay: 300, duration: 400, easing: expoInOut }}" out:fade="{{ delay: 0, duration: 400, easing: expoOut}}">
	{#if has_help}
	<Help>
	<slot name="help"></slot>
	</Help>
	{/if}	
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold">{title}</div>
	<div style="width: 40%;"><hr></div>
	<slot>
	</slot>
</div>	