<script>
	import { onMount, onDestroy } from 'svelte';
	import { DateTime } from 'luxon';
	import Box from '../../ui/Box.svelte';
	import { config_store } from '../../../lib/stores/config.js';
	import { push } from 'svelte-spa-router';

	/** Show the ← Older / Current → navigation bar (disable on the main page) */
	export let showNav = true;
	/** When true (main page), clicking the chart navigates to History › Live Data */
	export let historyLink = false;

	// ── SVG layout constants ──────────────────────────────────────────────────
	const W = 600, H = 260;
	const PL = 52, PR = 58, PT = 20, PB = 44;
	const cW = W - PL - PR;
	const cH = H - PT - PB;

	let loading    = true;
	let error      = false;
	let noOlder    = false;
	let historical = false;

	/** @type {{ ts: number, a: number, t: number, e: number }[]} */
	let samples = [];

	// Tracks the URL of the most recent successful (or attempted) fetch so the
	// View JSON / Download links always point at what is currently displayed.
	let currentApiUrl = '/api/energy/raw';

	async function fetchRaw(/** @type {number} */ before = 0) {
		const url = before > 0 ? `/api/energy/raw?before=${before}` : '/api/energy/raw';
		currentApiUrl = url;
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error();
			return await res.json();
		} catch {
			return null;
		}
	}

	async function loadCurrent() {
		loading    = true;
		error      = false;
		noOlder    = false;
		historical = false;
		const data = await fetchRaw();
		loading    = false;
		if (!data || !data.samples) { error = true; return; }
		samples = data.samples;
	}

	async function loadOlder() {
		if (!samples.length) return;
		const oldest = Math.min(...samples.map(s => s.ts));
		loading = true;
		const data = await fetchRaw(oldest);
		loading = false;
		if (!data || !data.samples || data.samples.length === 0) {
			noOlder = true;
			return;
		}
		samples    = data.samples;
		historical = true;
		noOlder    = false;
	}

	$: downloadName = historical
		? `energy-raw-${currentApiUrl.split('before=')[1] ?? 'hist'}.json`
		: 'energy-raw-current.json';

	/** @type {ReturnType<typeof setInterval> | null} */
	let refreshTimer = null;

	onMount(() => {
		loadCurrent();
		refreshTimer = setInterval(() => {
			if (!historical) loadCurrent();
		}, 60000);
	});

	onDestroy(() => {
		if (refreshTimer !== null) clearInterval(refreshTimer);
	});

	// ── Axis helpers ──────────────────────────────────────────────────────────
	function niceStep(/** @type {number} */ raw) {
		if (raw <= 0) return 1;
		const e = Math.floor(Math.log10(raw));
		const f = raw / 10 ** e;
		return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * 10 ** e;
	}
	function niceTicks(/** @type {number} */ min, /** @type {number} */ max, count = 5) {
		if (max <= min) return [+min.toFixed(4)];
		const step = niceStep((max - min) / count);
		const start = Math.ceil(min / step) * step;
		/** @type {number[]} */
		const ticks = [];
		for (let t = start; t <= max + step * 0.01; t = +(t + step).toPrecision(10))
			ticks.push(+t.toFixed(8));
		return ticks;
	}
	function fmtNum(/** @type {number} */ v) { return v % 1 === 0 ? String(v) : v.toFixed(1); }

	// ── Reactive scales ───────────────────────────────────────────────────────
	$: n   = samples.length;
	$: ts0 = n ? samples[0].ts : 0;
	$: tsN = n ? samples[n - 1].ts : 1;
	$: tx  = (/** @type {number} */ ts) => PL + ((ts - ts0) / (tsN - ts0 || 1)) * cW;

	// Left axis: Current (A) — fixed 0 to hardware max + 5
	$: aMin   = 0;
	$: aMax   = ($config_store.max_current_hard ?? 50) + 5;
	$: aTicks = niceTicks(aMin, aMax);
	$: aY     = (/** @type {number} */ v) => PT + cH * (1 - v / aMax);

	// Right axis: Temperature (°C) — fixed -20 to 80
	const tMin = -20;
	const tMax = 80;
	const tTicks = niceTicks(tMin, tMax);
	$: tY = (/** @type {number} */ v) => PT + cH * (1 - (v - tMin) / (tMax - tMin));

	// Polyline point strings
	$: ampPts = samples.map(s => `${tx(s.ts).toFixed(1)},${aY(s.a).toFixed(1)}`).join(' ');
	$: tmpPts = samples
		.filter(s => s.t > 0)
		.map(s => `${tx(s.ts).toFixed(1)},${tY(s.t).toFixed(1)}`).join(' ');

	// X-axis: ~6 evenly spaced labels
	$: xLabels = (() => {
		if (!n) return [];
		const totalSec = tsN - ts0;
		const fmt = totalSec < 86400 ? 'HH:mm' : 'MM/dd HH:mm';
		const step = Math.max(1, Math.round(n / 6));
		/** @type {{ x: number, label: string }[]} */
		const out = [];
		for (let i = 0; i < n; i += step)
			out.push({ x: tx(samples[i].ts), label: DateTime.fromSeconds(samples[i].ts).toFormat(fmt) });
		return out;
	})();
</script>

<Box title="Live Energy Data" icon="fa6-solid:chart-line">

	{#if showNav}
	<div class="is-flex is-align-items-center is-justify-content-space-between mb-2" style="min-height:2rem">
		<button class="button is-small" on:click={loadOlder}
			disabled={loading || noOlder || !n}>
			← Older
		</button>

		{#if noOlder}
			<span class="is-size-7 has-text-grey">No earlier data</span>
		{:else if historical}
			<span class="is-size-7 has-text-grey">Historical view</span>
		{:else}
			<span class="is-size-7 has-text-grey">Latest {n} samples</span>
		{/if}

		{#if historical}
			<button class="button is-small is-primary" on:click={loadCurrent} disabled={loading}>
				Current →
			</button>
		{:else}
			<div style="width:5rem"></div>
		{/if}
	</div>
	{/if}

	<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
	<div
		style={historyLink ? 'cursor:pointer' : ''}
		on:click={() => { if (historyLink) push('/history'); }}
		on:keypress={(e) => { if (historyLink && e.key === 'Enter') push('/history'); }}
	>
	{#if loading}
		<div class="has-text-centered p-4">Loading…</div>
	{:else if error}
		<div class="has-text-centered p-4 has-text-danger">Failed to load energy data</div>
	{:else if !samples.length}
		<div class="has-text-centered p-4 has-text-grey">No samples recorded yet</div>
	{:else}
		<svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;display:block;overflow:visible">

			<!-- Horizontal gridlines (based on amp ticks) -->
			{#each aTicks as t}
				<line x1={PL} x2={W-PR} y1={aY(t)} y2={aY(t)} stroke="#e8e8e8" stroke-width="1"/>
			{/each}

			<!-- Chart border -->
			<rect x={PL} y={PT} width={cW} height={cH} fill="none" stroke="#bbb" stroke-width="1"/>

			<!-- Left Y-axis: Current (A) -->
			{#each aTicks as t}
				<line x1={PL-4} x2={PL} y1={aY(t)} y2={aY(t)} stroke="rgb(54,162,235)" stroke-width="1"/>
				<text x={PL-7} y={aY(t)} text-anchor="end" dominant-baseline="middle" font-size="10" fill="rgb(54,162,235)">{fmtNum(t)}</text>
			{/each}
			<text transform="rotate(-90)" x={-(PT+cH/2)} y="13" text-anchor="middle" font-size="10" fill="rgb(54,162,235)">A</text>

			<!-- Right Y-axis: Temperature (°C) -->
			{#each tTicks as t}
				<line x1={W-PR} x2={W-PR+4} y1={tY(t)} y2={tY(t)} stroke="rgb(255,99,132)" stroke-width="1"/>
				<text x={W-PR+7} y={tY(t)} text-anchor="start" dominant-baseline="middle" font-size="10" fill="rgb(255,99,132)">{fmtNum(t)}</text>
			{/each}
			<text transform="rotate(90)" x={PT+cH/2} y={-(W-9)} text-anchor="middle" font-size="10" fill="rgb(255,99,132)">°C</text>

			<!-- X-axis labels -->
			{#each xLabels as {x, label}}
				<line x1={x} x2={x} y1={PT+cH} y2={PT+cH+4} stroke="#555" stroke-width="1"/>
				<text x={x} y={PT+cH+14} text-anchor="middle" font-size="9" fill="#555">{label}</text>
			{/each}

			<!-- Current line -->
			{#if ampPts}
				<polyline points={ampPts} fill="none" stroke="rgb(54,162,235)" stroke-width="1.8" stroke-linejoin="round"/>
			{/if}

			<!-- Temperature line -->
			{#if tmpPts}
				<polyline points={tmpPts} fill="none" stroke="rgb(255,99,132)" stroke-width="1.8" stroke-linejoin="round"/>
			{/if}

			<!-- Legend -->
			<rect x={PL+8} y={PT+6} width={138} height={32} fill="white" fill-opacity="0.88" rx="3" stroke="#ddd" stroke-width="1"/>
			<line x1={PL+16} x2={PL+28} y1={PT+17} y2={PT+17} stroke="rgb(54,162,235)" stroke-width="2"/>
			<text x={PL+32} y={PT+20} font-size="10" fill="#333">Current (A)</text>
			<line x1={PL+16} x2={PL+28} y1={PT+29} y2={PT+29} stroke="rgb(255,99,132)" stroke-width="2"/>
			<text x={PL+32} y={PT+32} font-size="10" fill="#333">Temperature (°C)</text>
		</svg>
	{/if}
	{#if historyLink}
	<p class="has-text-right is-size-7 has-text-info pr-1 pb-1">View full chart →</p>
	{/if}
	</div>

	{#if !loading && showNav}
	<div class="is-flex is-justify-content-flex-end mt-2" style="gap:0.4rem">
		<a href={currentApiUrl} target="_blank" rel="noopener noreferrer"
		   class="button is-small is-light">View JSON</a>
		<a href={currentApiUrl} download={downloadName}
		   class="button is-small is-light">Download</a>
	</div>
	{/if}

</Box>
