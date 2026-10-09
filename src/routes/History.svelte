<script>
	import CentralView        from './../components/ui/CentralView.svelte';
	import Logs               from './../components/blocks/history/Logs.svelte';
	import EnergyRawChart     from './../components/blocks/energy/EnergyRawChart.svelte';
	import EnergySummaryChart from './../components/blocks/energy/EnergySummaryChart.svelte';

	const tabs = [
		{ label: 'Live Data' },
		{ label: 'Energy History' },
		{ label: 'Event Logs' },
	];

	let activetab = 0;
</script>

<CentralView>
	<div class="tabs is-centered mt-2 mb-0">
		<ul>
			{#each tabs as tab, i}
				<li class:is-active={activetab === i}>
					<a href="/history" on:click|preventDefault={() => activetab = i} class="has-text-weight-bold">
						{tab.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	{#if activetab === 0}
		<EnergyRawChart />
	{:else if activetab === 1}
		<EnergySummaryChart />
	{:else}
		<Logs />
	{/if}
</CentralView>
