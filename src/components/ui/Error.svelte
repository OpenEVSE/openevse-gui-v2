<script>
	export let title;
	export let message = "Can't reach OpenEVSE wifi mod	ule";
	export let refetch = () => {}; 
</script>

  <div class="is-size-6 has-text-weight-bold my-2">{title}:</div>
  <div class="is-size-6 has-text-weight-normal mb-5">{message}</div>
  <button class="button tag is-size-6 is-info mt-3" on:click={refetch}>Refresh</button>
