<script>
	import Signal1 from './svg/wifi_signal_1.svelte';
	import Signal2 from './svg/wifi_signal_2.svelte';
	import Signal3 from './svg/wifi_signal_3.svelte';
	import Signal4 from './svg/wifi_signal_4.svelte';
	import Signal5 from './svg/wifi_signal_5.svelte';

	export let dbm
	let icon

	function getIcon(id) {
		let i
		switch (id) {
			case 1: 
				i = Signal1
				break
			case 2: 
				i = Signal2
				break
			case 3: 
				i = Signal3
				break
			case 4: 
				i = Signal4
				break
			case 5: 
				i = Signal5
				break
		}
	return i
	}

	export function dbm2icon(dbm) {
		let signal
		if (dbm <= -80) signal = 1
		else if (dbm > -80 && dbm <= -75) signal = 2
		else if (dbm > -75 && dbm <= -70) signal = 3
		else if (dbm > -70 && dbm <= -65) signal = 4
		else if (dbm > -65) signal = 5

	    icon = getIcon(signal)
	}

$: dbm2icon(dbm)
</script>

<svelte:component this={icon}/>