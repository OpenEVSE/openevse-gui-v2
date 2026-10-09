<script>
	import { onMount } from 'svelte';
	import Box from '../../ui/Box.svelte';

	// ── SVG layout constants ──────────────────────────────────────────────────
	const W = 600, H = 280;
	const PL = 52, PR = 62, PT = 24, PB = 52;
	const cW = W - PL - PR;
	const cH = H - PT - PB;

	const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	const VIEWS = [
		{ id: 'daily',   label: 'Daily',   key: 'daily',   dateKey: 'dt', unit: 'kWh', toKwh: 1000 },
		{ id: 'monthly', label: 'Monthly', url: '/api/energy/monthly', key: 'monthly', dateKey: 'mo', unit: 'kWh', toKwh: 1 },
		{ id: 'annual',  label: 'Annual',  url: '/api/energy/annual',  key: 'annual',  dateKey: 'yr', unit: 'kWh', toKwh: 1 },
	];

	const QUARTER_LABELS = ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec'];

	/** @type {string} */
	let activeView = 'daily';

	/** @type {{ label: string, pk: number, mn: number, en: number }[]} */
	let records = [];

	/** @type {string} */
	let energyUnit = 'kWh';

	let loading = true;
	let error   = false;

	const _now        = new Date();
	const currentYear = _now.getFullYear();
	const currentQtr  = Math.ceil((_now.getMonth() + 1) / 3);

	let dailyYear = currentYear;
	let dailyQtr  = currentQtr;

	function dailyUrl() {
		return `/api/energy/daily?year=${dailyYear}&quarter=${dailyQtr}`;
	}

	/** @param {number} y @param {number} q @returns {string} */
	function qtrLabel(y, q) { return `${QUARTER_LABELS[q - 1]} ${y}`; }

	function prevQtr() {
		dailyQtr--;
		if (dailyQtr < 1) { dailyQtr = 4; dailyYear--; }
		loadView('daily');
	}
	function nextQtr() {
		dailyQtr++;
		if (dailyQtr > 4) { dailyQtr = 1; dailyYear++; }
		loadView('daily');
	}
	$: isCurrentQtr = dailyYear === currentYear && dailyQtr === currentQtr;

	// ── Monthly year navigation ───────────────────────────────────────────────
	let monthlyYear = currentYear;

	function monthlyUrl() {
		return `/api/energy/monthly?year=${monthlyYear}`;
	}

	function prevMonthlyYear() { monthlyYear--; loadView('monthly'); }
	function nextMonthlyYear() { monthlyYear++; loadView('monthly'); }
	$: isCurrentYear = monthlyYear === currentYear;

	async function loadView(/** @type {string} */ viewId) {
		activeView = viewId;
		loading = true;
		error   = false;
		records = [];

		const view = VIEWS.find(v => v.id === viewId);
		if (!view) return;

		const url = viewId === 'daily'   ? dailyUrl()
		          : viewId === 'monthly' ? monthlyUrl()
		          : /** @type {string} */ (view.url);

		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error();
			const data = await res.json();
			const raw = /** @type {any[]} */ (data[view.key] ?? []);
			records = raw.map(r => ({
				label: String(r[view.dateKey]),
				pk:    Number(r.pk),
				mn:    Number(r.mn),
				en:    Number(r.en) / view.toKwh,
			}));
			energyUnit = view.unit;
		} catch {
			error = true;
		}
		loading = false;
	}

	onMount(() => loadView('daily'));

	// ── Axis helpers ──────────────────────────────────────────────────────────
	/** @param {number} raw @returns {number} */
	function niceStep(raw) {
		if (raw <= 0) return 1;
		const e = Math.floor(Math.log10(raw));
		const f = raw / 10 ** e;
		return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * 10 ** e;
	}
	/** @param {number} min @param {number} max @param {number} [count] @returns {number[]} */
	function niceTicks(min, max, count = 5) {
		if (max <= min) return [+min.toFixed(4)];
		const step = niceStep((max - min) / count);
		const start = Math.ceil(min / step) * step;
		/** @type {number[]} */
		const ticks = [];
		for (let t = start; t <= max + step * 0.01; t = +(t + step).toPrecision(10))
			ticks.push(+t.toFixed(8));
		return ticks;
	}
	/** @param {number} v @returns {string} */
	function fmtNum(v) { return v % 1 === 0 ? String(v) : v.toFixed(1); }

	// ── Reactive scales ───────────────────────────────────────────────────────
	$: n      = records.length;
	$: barW   = n ? cW / n : cW;
	// Squeeze padding to near-zero for large daily datasets so bars stay visible
	$: barPad = n > 60 ? barW * 0.03 : barW * 0.12;
	$: xC     = (/** @type {number} */ i) => PL + (i + 0.5) * barW;

	// Left axis: temperature
	$: tmpAll = records.flatMap(r => [r.pk, r.mn]);
	$: tMin   = tmpAll.length ? Math.min(...tmpAll) - 2 : 0;
	$: tMax   = tmpAll.length ? Math.max(...tmpAll) + 2 : 40;
	$: tTicks = niceTicks(tMin, tMax);
	$: tY     = (/** @type {number} */ v) => PT + cH * (1 - (v - tMin) / (tMax - tMin || 1));

	// Right axis: energy
	$: enMax   = Math.max(...records.map(r => r.en), 1);
	$: enTicks = niceTicks(0, enMax);
	$: enY     = (/** @type {number} */ v) => PT + cH * (1 - v / enMax);

	// Polyline strings
	$: pkPts = records.map((r, i) => `${xC(i).toFixed(1)},${tY(r.pk).toFixed(1)}`).join(' ');
	$: mnPts = records.map((r, i) => `${xC(i).toFixed(1)},${tY(r.mn).toFixed(1)}`).join(' ');

	// X-axis labels: month names for yearly daily view, evenly spaced otherwise
	$: xLabelItems = (() => {
		if (!n) return /** @type {{ x: number, label: string }[]} */ ([]);
		if (activeView === 'daily' && n > 30) {
			// One label per month at its first record's position
			/** @type {{ x: number, label: string }[]} */
			const items = [];
			let lastMon = '';
			records.forEach((r, i) => {
				const mon = r.label.slice(5, 7);  // MM from YYYY-MM-DD
				if (mon !== lastMon) {
					items.push({ x: xC(i), label: MONTH_ABBR[parseInt(mon, 10) - 1] });
					lastMon = mon;
				}
			});
			return items;
		}
		const step = Math.max(1, Math.round(n / 6));
		/** @type {{ x: number, label: string }[]} */
		const items = [];
		for (let i = 0; i < n; i += step)
			items.push({ x: xC(i), label: records[i].label });
		return items;
	})();

	// Only show per-point dots when the dataset is small enough to be readable
	$: showDots = n <= 30;

	// URL of the data currently displayed — used by View JSON / Download links
	$: dataUrl = activeView === 'daily'
		? `/api/energy/daily?year=${dailyYear}&quarter=${dailyQtr}`
		: activeView === 'monthly'
		? `/api/energy/monthly?year=${monthlyYear}`
		: VIEWS.find(v => v.id === activeView)?.url ?? '';

	$: downloadName = activeView === 'daily'
		? `energy-daily-${dailyYear}-Q${dailyQtr}.json`
		: activeView === 'monthly'
		? `energy-monthly-${monthlyYear}.json`
		: `energy-${activeView}.json`;
</script>

<Box title="Energy History" icon="fa6-solid:chart-column">

	<!-- View tabs -->
	<div class="tabs is-small is-centered mb-1">
		<ul>
			{#each VIEWS as v}
				<li class:is-active={activeView === v.id}>
					<a href="/history" on:click|preventDefault={() => loadView(v.id)}
					   class="has-text-weight-semibold">{v.label}</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Quarter navigation (daily view only) -->
	{#if activeView === 'daily'}
	<div class="is-flex is-align-items-center is-justify-content-space-between mb-2 px-2">
		<button class="button is-small" on:click={prevQtr} disabled={loading}>
			← {qtrLabel(dailyQtr === 1 ? dailyYear - 1 : dailyYear, dailyQtr === 1 ? 4 : dailyQtr - 1)}
		</button>
		<span class="has-text-weight-bold is-size-7">{qtrLabel(dailyYear, dailyQtr)}</span>
		{#if !isCurrentQtr}
			<button class="button is-small is-primary" on:click={nextQtr} disabled={loading}>
				{qtrLabel(dailyQtr === 4 ? dailyYear + 1 : dailyYear, dailyQtr === 4 ? 1 : dailyQtr + 1)} →
			</button>
		{:else}
			<div style="width:6rem"></div>
		{/if}
	</div>
	{/if}

	{#if activeView === 'monthly'}
	<div class="is-flex is-align-items-center is-justify-content-space-between mb-2 px-2">
		<button class="button is-small" on:click={prevMonthlyYear} disabled={loading}>
			← {monthlyYear - 1}
		</button>
		<span class="has-text-weight-bold is-size-7">{monthlyYear}</span>
		{#if !isCurrentYear}
			<button class="button is-small is-primary" on:click={nextMonthlyYear} disabled={loading}>
				{monthlyYear + 1} →
			</button>
		{:else}
			<div style="width:4rem"></div>
		{/if}
	</div>
	{/if}

	{#if loading}
		<div class="has-text-centered p-4">Loading…</div>
	{:else if error}
		<div class="has-text-centered p-4 has-text-danger">Failed to load energy data</div>
	{:else if !records.length}
		<div class="has-text-centered p-4 has-text-grey">No data recorded yet</div>
	{:else}
		<svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;display:block;overflow:visible">

			<!-- Horizontal gridlines -->
			{#each tTicks as t}
				<line x1={PL} x2={W-PR} y1={tY(t)} y2={tY(t)} stroke="#e8e8e8" stroke-width="1"/>
			{/each}

			<!-- Chart border -->
			<rect x={PL} y={PT} width={cW} height={cH} fill="none" stroke="#bbb" stroke-width="1"/>

			<!-- Energy bars -->
			{#each records as r, i}
				<rect
					x={PL + i * barW + barPad}
					y={enY(r.en)}
					width={Math.max(barW - barPad * 2, 0.5)}
					height={PT + cH - enY(r.en)}
					fill="rgba(75,192,192,0.55)" stroke="rgb(75,192,192)" stroke-width="0.5"/>
			{/each}

			<!-- Peak temp line -->
			{#if n > 1}
				<polyline points={pkPts} fill="none" stroke="rgb(255,99,132)" stroke-width="1.5" stroke-linejoin="round"/>
			{/if}
			{#if showDots}
				{#each records as r, i}
					<circle cx={xC(i)} cy={tY(r.pk)} r="3" fill="rgb(255,99,132)"/>
				{/each}
			{/if}

			<!-- Min temp line -->
			{#if n > 1}
				<polyline points={mnPts} fill="none" stroke="rgb(54,162,235)" stroke-width="1.5" stroke-linejoin="round"/>
			{/if}
			{#if showDots}
				{#each records as r, i}
					<circle cx={xC(i)} cy={tY(r.mn)} r="3" fill="rgb(54,162,235)"/>
				{/each}
			{/if}

			<!-- Left Y-axis: °C -->
			{#each tTicks as t}
				<line x1={PL-4} x2={PL} y1={tY(t)} y2={tY(t)} stroke="#555" stroke-width="1"/>
				<text x={PL-7} y={tY(t)} text-anchor="end" dominant-baseline="middle" font-size="10" fill="#555">{fmtNum(t)}</text>
			{/each}
			<text transform="rotate(-90)" x={-(PT+cH/2)} y="13" text-anchor="middle" font-size="10" fill="#666">°C</text>

			<!-- Right Y-axis: energy -->
			{#each enTicks as t}
				<line x1={W-PR} x2={W-PR+4} y1={enY(t)} y2={enY(t)} stroke="#555" stroke-width="1"/>
				<text x={W-PR+7} y={enY(t)} text-anchor="start" dominant-baseline="middle" font-size="10" fill="#555">{fmtNum(t)}</text>
			{/each}
			<text transform="rotate(90)" x={PT+cH/2} y={-(W-9)} text-anchor="middle" font-size="10" fill="#666">{energyUnit}</text>

			<!-- X-axis labels -->
			{#each xLabelItems as {x, label}}
				<text x={x} y={PT+cH+15} text-anchor="middle" font-size="10" fill="#555">{label}</text>
			{/each}

			<!-- Legend -->
			<rect x={PL+8} y={PT+6} width={180} height={46} fill="white" fill-opacity="0.88" rx="3" stroke="#ddd" stroke-width="1"/>
			<rect x={PL+14} y={PT+11} width="12" height="10" fill="rgba(75,192,192,0.55)" stroke="rgb(75,192,192)" stroke-width="1"/>
			<text x={PL+30} y={PT+20} font-size="10" fill="#333">Energy ({energyUnit})</text>
			<line x1={PL+14} x2={PL+26} y1={PT+30} y2={PT+30} stroke="rgb(255,99,132)" stroke-width="2"/>
			<text x={PL+30} y={PT+33} font-size="10" fill="#333">Peak Temp (°C)</text>
			<line x1={PL+14} x2={PL+26} y1={PT+42} y2={PT+42} stroke="rgb(54,162,235)" stroke-width="2"/>
			<text x={PL+30} y={PT+45} font-size="10" fill="#333">Min Temp (°C)</text>
		</svg>
	{/if}

	{#if !loading}
	<div class="is-flex is-justify-content-flex-end mt-2" style="gap:0.4rem">
		<a href={dataUrl} target="_blank" rel="noopener noreferrer"
		   class="button is-small is-light">View JSON</a>
		<a href={dataUrl} download={downloadName}
		   class="button is-small is-light">Download</a>
	</div>
	{/if}

</Box>
