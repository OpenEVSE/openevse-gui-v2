<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faUpload} from '@fortawesome/free-solid-svg-icons/index.js'
	export let file = ""

	const onFileSelected =(e)=>{
		file = e.target.files[0];
	}

</script>
<button class="button my-1 is-info is-outlined">
	  <input class="file-input" type="file" on:change={(e)=>onFileSelected(e)} accept="*" />
			<Fa icon={faUpload}/>
		  Choose a file…
</button>