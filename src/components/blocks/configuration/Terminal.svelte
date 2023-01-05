<script>
	import { onMount, onDestroy } from "svelte";

	export let mode
	export let opened = false
	let socket
	let terminal = ""

	function connect2socket(mode) {
		// let host 	= window.location.host
		let host 	= "192.168.1.8"
		let ishttps = location.protocol === "https:"
		let proto 	= ishttps?"wss://":"ws://"
		if (!socket) {
			console.log("opening Terminal socket")
			// if (mode != "debug" || mode != "evse") 
			// 	mode = "debug"
			console.log("mode: " + mode)
			socket = new WebSocket(proto + host + "/" + mode + "/console")
			socket.binaryType = "arraybuffer";
			socket.addEventListener("open", function (event) {
				console.log("connected to Terminal websocket")
			} )
			socket.addEventListener("message", function (e) {
				let line
				if (e.data instanceof ArrayBuffer) {
					// binary frame
					const view = new DataView(e.data);
					console.log(view.getInt32(0));
					line = view.getInt32(0)
				} else {
					// text frame
					console.log(e.data);
					line = e.data
				}
				terminal += line
			})
			socket.addEventListener("error", function (e) {
				console.error('Terminal Socket encountered error: ', e, 'Closing socket');
			})
			socket.addEventListener("close", function (e) {
				console.log('Terminal Socket is closed.', e.reason);
				socket = null;
				connect2socket(mode)			
			})
		}
	}
	function handleSocket(opened) {
		if(opened) {
			connect2socket(mode)	
		}
		else {
			if (socket)
			{
				socket.close()
				socket = null
			}

			
		}
	}

	// onMount( ()=>{
	// 	connect2socket(mode)
	// })
	onDestroy (()=> {
		if(socket)
			socket.close()
		socket = null
	})

	$: handleSocket(opened)
</script>
<style>
	.term {
		border: solid;
		border-color: white;
		overflow: hidden;
		color:#fff;
		background-color:rgb(12, 40, 61);
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
		background-color: black;
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

<div class="bg is-overlay" class:is-hidden={!opened} on:click={()=>opened=false} on:keypress={()=>opened=false}>
	<div class="term is-size-7" on:click|stopPropagation on:keypress|stopPropagation>
		<pre>{terminal}</pre>
	</div>
</div>
