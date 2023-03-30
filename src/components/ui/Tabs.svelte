<script>
	import { link } from "svelte-spa-router";
	export let tabs = []  // [{name: "name", url: "/", action: function}, ...]
	export let activetab
	export let onClick = (i) => {}
	let linkid = []
	// onMount(()=> {
	// 	activetab = tabs[0].name
	// })

</script>
<style>

	.tab:focus {
		outline: none;
		background-color: hsl(0, 0%, 96%);
	}

</style>
<div class="mb-2">
	<div class="tabs is-size-6">
		<ul>
			{#each tabs as tab,i}
			<li class:is-active={activetab==i}>
				<a bind:this={linkid[i]} class="tab" class:has-text-danger={tab.alert} href={tab.url} use:link on:click|preventDefault={() => {onClick(i); linkid[i].blur()}}>
				<span class="has-text-weight-bold">{tab.name}</span>
				</a>
			</li>
			{/each}
		</ul>
	</div>
</div>