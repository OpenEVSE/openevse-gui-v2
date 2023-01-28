<script>
	import { _ } from 'svelte-i18n'
</script>
{@html $_("config.ohm.desc")}
<div class="mt-2">
	{@html $_("config.ohm.ohmkey-desc")}<br>
	<span class="has-text-weight-bold">{$_("config.ohm.example")}: </span><span>https://login.ohmconnect.com/verify-ohm-hour/OpnEoVse</span><br>
	<span class="has-text-weight-bold">{$_("config.ohm.key")}:</span>OpnEoVse
</div>