<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { onMount, onDestroy } 		 from "svelte";
	import {httpAPI} 					 from "./../../../lib/utils.js"
	export let mode
	export let opened = false
	let socket
	let termscreen
	let content
	let timeout

	async function connect2socket(mode) {
		let host 	= window.location.host
		let ishttps = location.protocol === "https:"
		let proto 	= ishttps?"wss://":"ws://"
		let url = location.protocol + "//" + location.host + "/" + mode
		let res = await httpAPI("GET",url,null,"text")

		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
			
		if (res && (res.msg != "error" && res != "error")) {
			res = res.replace(/(\r\n|\n|\r)/gm, "\n");
			content.innerHTML = res
			setTimeout(() => {
				termscreen.scroll({ top: termscreen.scrollHeight});
			}, 100);		}
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

				var data = content.innerHTML.split(/\r?\n/);
				if (data.length > 2000) {
					data = data.slice(-data.length,-data.length + 200)
					content.innerHTML = data.join('\n')
				}
				
				if (content.length > 51200)
					content = ""
				// terminal += line
				if (line && termscreen) {
					content.append(line)
					scrollToBottom(termscreen)
				}		
			})
			socket.addEventListener("error", function (e) {
				console.error('Terminal Socket encountered error. Closing socket');
			})
			socket.addEventListener("close", function (e) {
				console.log('Terminal Socket is closed.', e.reason);
				socket = null;
				if (opened)
					timeout = setTimeout(() => {
						connect2socket(mode)	
					}, 500);		
			})
		}
	}
	const scrollToBottom = async (node) => {
		if ( node.scrollTop + 20 >= (node.scrollHeight - node.clientHeight )) {
			node.scroll({ top: node.scrollHeight});
		}
	}

	// beforeUpdate(() => {
	// 	autoscroll = termscreen && (termscreen.offsetHeight + termscreen.scrollTop) > (termscreen.scrollHeight - 20);
	// });

	// afterUpdate(() => {
	// 	if (autoscroll) termscreen.scrollTo(0, termscreen.scrollHeight);
	// });

	onMount( ()=>{
		connect2socket(mode)
	})
	onDestroy (()=> {
		if(socket)
			socket.close()
		socket = null
		clearTimeout(timeout)
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
		<pre bind:this={content}></pre>
	</div>
</div>
