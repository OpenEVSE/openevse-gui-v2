<script>
	import { scale, fade,slide } from 'svelte/transition';
	import { elasticIn, elasticOut, elasticInOut, backInOut, backIn, backOut, expoIn, expoOut, expoInOut } from 'svelte/easing';
	import {onMount,onDestroy} from "svelte"
	export let title = "title"
</script>

<div class="box is-unselectable pt-3"  in:scale="{{ delay: 300, duration: 400, easing: expoInOut }}" out:fade="{{ delay: 0, duration: 400, easing: expoOut}}">	
	<div class="is-size-5 has-text-weight-bold mb-1">{title}</div>	
		<slot>
		</slot>
</div>