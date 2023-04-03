<script>
	import {_, format} from 'svelte-i18n'
</script>
<style>
	.content {
		white-space: pre-line;
	}
</style>
<div>
	<p class="content">
		{@html
			$_('config.shaper.help-main',
				{values: {data: "{\"shaper_live_pwr\": value}"}}
			)
		}
		<br><br>
		{$_('config.shaper.help-mqtt',
		{values: {data: '{"shaper_live_pwr": xxx}'}}
	)}
	</p>
</div>