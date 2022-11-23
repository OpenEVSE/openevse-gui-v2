<script>
	import { scale, fade} from 'svelte/transition';
	import { expoOut, expoInOut } from 'svelte/easing';
	export let title = "title"
</script>

<div class="box is-unselectable mt-2 mb-4 pt-3"  in:scale="{{ delay: 300, duration: 400, easing: expoInOut }}" out:fade="{{ delay: 0, duration: 400, easing: expoOut}}">	
	<div class="is-size-5 has-text-weight-bold mb-1">{title}</div>	
		<slot>
		</slot>
</div>	