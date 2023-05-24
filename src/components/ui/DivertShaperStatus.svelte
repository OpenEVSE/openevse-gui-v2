<script>
	import { override_store } from "./../../lib/stores/override.js";
	import { config_store } from "./../../lib/stores/config.js";
	import { _ } 			  from 'svelte-i18n'
	import { status_store }   from "./../../lib/stores/status.js";
	import {round} 			  from "../../lib/utils.js"
	
</script>

{#if $config_store.divert_enabled}
<div class="mt-2 mb-0 ml-1 is-flex is-flex-direction-row is-justify-content-left is-align-items-center is-flex-wrap-wrap is-size-7 has-text-weight-bold">
	<iconify-icon class="has-text-primary is-size-6 mr-1" icon="fa6-solid:solar-panel"></iconify-icon>
	{#if $config_store.divert_type == 0}
	<div class="mr-1 is-inline-block has-text-dark">
		<span>{$_("status-divert-production")}:</span>
		<span class="{$status_store.solar < 6?"has-text-danger":"has-text-primary"}">{$status_store.solar}W</span>
		<span>|</span>
		<span class="{$status_store.solar < 6?"has-text-danger":"has-text-primary"}">{$status_store.charge_rate}A</span>
	</div>

	{:else if $config_store.divert_type == 1}
	<div class="mr-1 has-text-dark">
		<span>{$_("status-divert-grid")}:</span>
		<span class="{$status_store.grid_ie < 0 ? "has-text-primary":"has-text-danger"}">{$status_store.grid_ie}W</span>
		<span class="{$status_store.grid_ie < 6?"has-text-danger":"has-text-primary"}">{$status_store.charge_rate}A</span>
	</div>
	{/if}
	<div class="mr-2 has-text-dark" class:is-hidden={!$status_store.smoothed_available_current}>
		<span>{$_("status-divert-smoothed")}:</span>
		<span class="has-text-info">{round($status_store.smoothed_available_current,1)}A</span>
	</div>
	{#if !$status_store.divert_active}
	<div class="mx-1">
		{#if $status_store.divertmode == 2 && $override_store?.state == undefined}
		<span class="has-text-info">{$_("config.selfprod.disabled")}</span>
		{:else}
		<span class="has-text-info">{$_("config.selfprod.modeboost")}</span>
		{/if}
	</div>
	{/if}
</div>
{/if}
{#if $status_store.shaper}
<div class="mt-2 mb-0 ml-1 is-flex is-flex-direction-row is-justify-content-left is-align-items-center is-flex-wrap-wrap is-size-6 has-text-weight-bold" style="padding-left: 3px;">
	<iconify-icon class="has-text-info mr-1" icon="fa6-solid:building-shield"></iconify-icon>
	<span class="is-size-7 mr-2 has-text-weight-bold has-text-dark">{$_("config.shaper.load")}: <span class="has-text-info">{$status_store.shaper_live_pwr} W</span></span>
	<span class="is-size-7 mr-2 has-text-weight-bold has-text-dark">{$_("config.shaper.available")}: <span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">{round($status_store.shaper_cur,2)} A</span></span>
</div>
	{#if $status_store.shaper_updated == false}
	<div class="is-size-7 mr-2 has-text-danger">{$_("status-shaper-error")}</div>
	{/if}
{/if}