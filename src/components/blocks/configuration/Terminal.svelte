<script>
	import { onMount, onDestroy } from "svelte";

	export let mode
	export let opened = false
	let socket
	let terminal = ""
	let termscreen

	function connect2socket(mode) {
		let host 	= window.location.host
		// let host 	= "openevse.local"
		let ishttps = location.protocol === "https:"
		let proto 	= ishttps?"wss://":"ws://"
		if (!socket) {
			console.log("opening Terminal socket")
			socket = new WebSocket(proto + host + "/" + mode + "/console")
			socket.addEventListener("open", function (event) {
				console.log("connected to Terminal websocket")
			} )
			socket.addEventListener("message", function (e) {
				let line
				line = e.data
				line = line.replace(/(\r\n|\n|\r)/gm, "\n");
				if (terminal.length > 51200)
					terminal = ""
				terminal += line
				scrollToBottom(termscreen);
				
			})
			socket.addEventListener("error", function (e) {
				console.error('Terminal Socket encountered error. Closing socket');
			})
			socket.addEventListener("close", function (e) {
				console.log('Terminal Socket is closed.', e.reason);
				socket = null;
				if (opened)
					setTimeout(() => {
						connect2socket(mode)	
					}, 500);		
			})
		}
	}
	

	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	}; 

	onMount( ()=>{
		connect2socket(mode)
	})
	onDestroy (()=> {
		if(socket)
			socket.close()
		socket = null
	})

</script>
<style>
	.term {
		border: solid;
		border-color: white;
		overflow-y: auto;
		overflow-x: hidden;
		color:#fff;
		background-color:black;
		width: 90%;
		height: 90%;
		position:absolute;
		z-index: 5;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		
    }
	.bg {
		position: fixed;
		top: 0px;
		left: 0px;
		padding: 0px;
		background-color: rgb(12, 40, 61);
		opacity: 90%;
		width: 100vw;
		height: 100vh;
		z-index: 4;
	}
    pre {
		word-break: break-all;
		white-space: pre-wrap;
		background: none;
		color: white;
    }
</style>

<div class="bg is-overlay" on:click={()=>opened=false} on:keypress={()=>opened=false}>
	<div bind:this={termscreen} class="term is-size-7" on:click|stopPropagation on:keypress|stopPropagation>
		<pre>{terminal}</pre>
	</div>
</div>
