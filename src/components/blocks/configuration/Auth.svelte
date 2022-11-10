<script>
	import { config_store } from "./../../../lib/stores-simu/config.js";
	import InputForm from "../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"
	import {httpAPI} from "../../../lib/utils.js"

	let usr = ""
	let pwd = ""
	let submit = () => {
		console.log("save user/pass")
		//config_store.
	}
	let submitState = "default"



</script>
<Box title="Authentification">
	<InputForm title="Username" bind:value={usr} placeholder="Admin" type="text"  />
	<InputForm title="Password" bind:value={pwd} placeholder="Password" type="password"  />
	<Button name="Save" color="is-primary" state={submitState} butn_submit={submit} />
</Box>