<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faSquarePen, faSquareMinus, faCalendarDays } from '@fortawesome/free-solid-svg-icons/index.js'
	import { link } from "svelte-spa-router";
	export let t_id;
	export let t_time;
	export let t_state;
	export let t_days;
	
	export let edit = (id) => {};

</script>
<tr>
	<th>{t_id}</th>
	<th>{t_time}</th>
	<th><span class="tag {t_state === 'active'?'is-primary':'is-danger'} py-0">{t_state}</span></th>
	<th class="is-size-5 py-1 px-1 has-tooltip-arrow has-tooltip" data-tooltip={t_days}>
		<Fa icon={faCalendarDays} />
	</th>
	<th class="is-size-5 py-1 px-1 pr-2">
		<a href="/schedule" use:link on:click={() => {edit(t_id)}}>
			<Fa icon={faSquarePen} />
		</a>
	</th>
	<th class="is-size-5 py-1 px-0" >
		<a href="/schedule" use:link class="has-text-danger">
			<Fa icon={faSquareMinus} />
		</a>
	</th>
</tr>