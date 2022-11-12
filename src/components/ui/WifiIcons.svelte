<script>
	import Icon from 'svelte-icon'
	import Signal1 from '../../assets/wifi_signal_1.svg';
	import Signal2 from '../../assets/wifi_signal_2.svg';
	import Signal3 from '../../assets/wifi_signal_3.svg';
	import Signal4 from '../../assets/wifi_signal_4.svg';
	import Signal5 from '../../assets/wifi_signal_5.svg';
	export let dbm = 0

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

	export function dbm2signal(dbm) {
		let signal
		if (dbm <= -80) signal = 1
		else if (dbm > -80 && dbm <= -75) signal = 2
		else if (dbm > -75 && dbm <= -70) signal = 3
		else if (dbm > -70 && dbm <= -65) signal = 4
		else if (dbm > -65) signal = 5

	return getIcon(signal)
	}
</script>

<!-- <Icon data={dbm2signal(dbm)} /> -->
<Icon data={Signal5} />