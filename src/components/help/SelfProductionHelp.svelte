<script>
	import { _ } from 'svelte-i18n'
</script>

<div>
	<div class="has-text-weight-bold is-size-6">
		{$_("config.selfprod.desc")}.
	</div>
	<div class="is-size-6">
		<ul>
			<li>- {$_("config.selfprod.help-1")}</li>
			<li>- {$_("config.selfprod.help-2")}</li>
			<li>- {$_("config.selfprod.help-3")}</li>
			<li>- {$_("config.selfprod.help-4")}</li>
			<li>- {$_("config.selfprod.help-5")}</li>
		</ul>
	</div>
</div>





