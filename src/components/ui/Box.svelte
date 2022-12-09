<script>
	import { scale, fade} from 'svelte/transition';
	import { expoOut, expoInOut } from 'svelte/easing';
	export let title = "title"
</script>
<style>
	hr {
  		border-top: 1px solid rgb(50, 179, 212);
		position: relative;
		margin-top: 0px;
		margin-bottom: 10px;
	}
</style>

<div class="box is-unselectable mt-2 mb-4 pt-3"  in:scale="{{ delay: 300, duration: 400, easing: expoInOut }}" out:fade="{{ delay: 0, duration: 400, easing: expoOut}}">	
	<div class="boxtitle has-text-info is-size-5 has-text-weight-bold">{title}</div>
	<div style="width: 40%;"><hr></div>
	<slot>
	</slot>
</div>	