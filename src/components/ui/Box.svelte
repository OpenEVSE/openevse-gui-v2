<script>
	import Help from "./Help.svelte";
	import { scale, fade} from 'svelte/transition';
	import { expoOut, expoInOut } from 'svelte/easing';
	import 'iconify-icon';

	export let title = "title"
	export let has_help = false
	export let visible = true
	export let icon = ""

</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 10px;
	}
</style>

<div class:is-hidden={!visible} class="box mt-2 mb-5 pt-3"  in:scale="{{ delay: 0, duration: 400, easing: expoInOut }}" >
	<div class:is-hidden={!has_help}>
		<Help>
		<slot name="help"></slot>
		</Help>
	</div>
	<div class="is-uppercase has-text-info is-size-5 has-text-weight-bold is-flex is-align-items-center">
		{#if icon}
		<div class="mr-1 mt-1">
 			<iconify-icon class="is-size-4" icon={icon}></iconify-icon>

		</div>
		{/if}
		<span>{title}</span>
	</div>
	<div style="width: 40%;"><hr></div>
	<slot>
	</slot>
</div>	