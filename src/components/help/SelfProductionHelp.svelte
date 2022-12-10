<div>
	<div class="has-text-weight-bold is-size-6">
		Dynamically adjust charge rate based on solar PV generation or excess power (grid export).
	</div>
	<div class="is-size-6">
		<ul>
			<li>If Production feed is available: charge rate is modulated based on energy produced.</li>
			<li>If Excess Power feed is available: charge rate will be modulated by available excess power.</li>
			<li>If EVSE is sleeping: charging will begin when solar PV / excess power > min charge rate.</li>
			<li>Charging will pause if the excess power drops below the min charge rate for a period of time.</li>
			<li>Note: It's assumed that EVSE power is included in the grid feed</li>
		</ul>
	</div>
</div>





