<script>
	import IconButton from "./../ui/IconButton.svelte"
	import {onMount, onDestroy} from 'svelte'
	import {faHome, faChartSimple, faTimeline, faCalendarDays, faGear} from '@fortawesome/free-solid-svg-icons/index.js'

	let selected
</script>

<style>
	.mobnav {
 		position: fixed;
  		top:	auto;
  		bottom: 0;
		width: 100%;
	}

</style>

<div class="mobnav is-flex is-justify-content-space-evenly is-align-items-center is-flex-direction-row has-background-black py-2">
		
		<a href="#"> <IconButton icon={faCalendarDays} size="2x"/> </a>
		<IconButton icon={faChartSimple} size="2x"/>
		<a href="#" active><IconButton icon={faHome} size="2x"/></a>
		<IconButton icon={faTimeline} size="2x"/>
		<IconButton icon={faGear} size="2x"/>
</div>