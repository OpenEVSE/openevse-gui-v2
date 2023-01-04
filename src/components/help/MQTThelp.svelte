<div>
	<div class="has-text-weight-bold is-size-6">
		Status
	</div>
	<div class="is-size-6">	
		[Base-topic]/status [value]
		<div class="is-size-7 has-text-weight-bold">
			<ul class="mt-0 mb-2">
				<li><span class="has-text-info">openevse/amp 16</span></li>
			</ul>
		</div>
		
		<div class="has-text-weight-bold">Claim</div>
			[Base-topic]/claim/set [json]
		<div class="is-size-7 has-text-weight-bold">
			<ul class="mt-0 mb-2">
				<li>get claim: <span class="has-text-info">openevse/claim</span></li>
				<li>set claim: <span class="has-text-info">openevse/claim/set &lbrace;'charge_current': 30, 'state': 'active'&rbrace;</span></li>
				<li>release claim: <span class="has-text-info">openevse/claim/set release</span></li>
			</ul>	
		</div>

		<div class="has-text-weight-bold">Override</div>
		[base-topic]/override/set [json]
		<div class="is-size-7 has-text-weight-bold">
			<ul class="mt-0 mb-2">
				<li>get override: <span class="has-text-info">/override</span></li>
				<li>set override: <span class="has-text-info">openevse/override/set &lbrace;'charge_current': 30, 'state': 'active'&rbrace;</span></li>
				<li>clear override: <span class="has-text-info">openevse/override clear </span></li>
			</ul>
		</div>
	</div>
</div>





