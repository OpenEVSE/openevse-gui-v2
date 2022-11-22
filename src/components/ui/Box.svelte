<script>
	import { scale, fade,slide } from 'svelte/transition';
	import { elasticIn, elasticOut, elasticInOut, backInOut, backIn, backOut } from 'svelte/easing';
	import {onMount,onDestroy} from "svelte"
	export let title = "title"
</script>

<div class="box is-unselectable pt-3"  in:scale="{{ delay: 400, duration: 400, easing: backInOut }}" out:scale="{{ delay: 0, duration: 400, easing: backInOut}}">	
	<div class="is-size-5 has-text-weight-bold mb-1">{title}</div>	
		<slot>
		</slot>
</div>