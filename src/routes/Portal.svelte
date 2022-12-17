<script>
	import Main from "./Main.svelte";
	import Evse from "./Evse.svelte";
	import Firmware from "./Firmware.svelte";
	import Network from "./Network.svelte";

</script>


<div class="columns is-centered">
	<div class="column is-two-thirds ">
		<Main />
		<Network />
		<Firmware />
		<Evse />

	</div>
</div>
