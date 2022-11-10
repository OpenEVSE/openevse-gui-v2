<script>
	import { link } from "svelte-spa-router";
	export let tabs = []  // [{name: "name", url: "/", action: function}, ...]
	export let activetab
	export let onClick = (i) => {}
	
	// onMount(()=> {
	// 	activetab = tabs[0].name
	// })

</script>
<style>
	.tab:hover {
		background-color: hsl(0, 0%, 96%);
	}
	.tab:focus {
		outline: none;
		background-color: hsl(0, 0%, 96%);
	}
</style>
<div class="tabs is-size-6">
	<ul>
		{#each tabs as tab,i}
		<li class:active={activetab==i} class={activetab == i?"is-active has-text-info":""}>
			<a class="tab is-toggle" href={tab.url} use:link on:click|preventDefault={() => {onClick(i)}}>
			<span>{tab.name}</span>
			</a>
		</li>
		{/each}
	</ul>
  </div>