<script>
	import { tweened } 		from "svelte/motion";
	import { cubicOut }		from "svelte/easing";
	export let value = 0

	const progress = tweened(0, {
		duration: 500,
		easing: cubicOut,
	})

	function updateProgress(val) {
		if (val != undefined)
		{
			progress.set(val)
			
		}
	}

	$: updateProgress(value)
</script>

<progress class="progress is-primary" value={$progress} max=100 />