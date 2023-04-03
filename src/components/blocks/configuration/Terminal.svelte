<script>
	import { uisettings_store } from "./../../../lib/stores/uisettings.js";
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
				content.scroll({ top: content.scrollHeight});
			}, 100);		}
		if (!socket) {
			console.log("opening Terminal socket")
			socket = new WebSocket(proto + host + "/" + mode + "/console")
			socket.addEventListener("open", function (event) {
				console.log("connected to Terminal websocket")
			} )
			socket.addEventListener("message", function (e) {
				let line
				line = e.data.toString();
				line = line.replace(/(\r\n|\n|\r)/gm, "\n");

				var data = content.innerHTML.split(/\r?\n/);
				if (data.length > 2000) {
					data = data.slice(-data.length,-data.length + 200)
					content.innerHTML = data.join('\n')
				}
				if (line) {
					content.append(line)
					scrollToBottom(content)
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
	const scrollToBottom = async (node,force = false) => {
		if ( node.scrollTop + 30 >= (node.scrollHeight - node.clientHeight ) || force) {
			node.scroll({ top: node.scrollHeight});
		}
	}

	const toggleFont = () => {
		$uisettings_store.term_fontbig = !$uisettings_store.term_fontbig
		setTimeout(() => {
			scrollToBottom(content,true)
		}, 100);
		
	}


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
		overflow-y: hidden;
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
		overflow-y: auto;
		width: 100%;
		height: 100%;
		
    }

	.blur-top {
		/* background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 5%, #000 100%); */
		background: linear-gradient(0deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.036852240896358524) 34%, rgba(0,0,0,1) 95%);

		width: calc(100% - 8px);
		height: 32px;
		top: 0px;
		left:0px;
		position: absolute;
	}
	
	.blur-bot {
		/* background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 5%, #000 100%); */
		background: linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.036852240896358524) 34%, rgba(0,0,0,1) 95%);

		width: calc(100% - 8px);
		height: 32px;
		bottom: 0px;
		left:0px;
		position: absolute;
	}

	.zoom {
		position: absolute;
		top: 4px;
		right: 14px;
		
	}
	.zoom a {
		color: white;
	}
	.zoom a:hover {
		color: hsl(189, 53%, 47%);
	}
</style>

<div class="bg is-overlay" on:click={()=>opened=false} on:keypress={()=>opened=false}>
	<div bind:this={termscreen} class="term is-size-{$uisettings_store.term_fontbig?6:7}" on:click|stopPropagation on:keypress|stopPropagation>
		<pre class="px-3 py-3" bind:this={content}></pre>
	<div class="blur-top"></div>
	<div class="blur-bot"></div>
	</div>
	<div class="zoom">
		<a href={null} on:click|stopPropagation={toggleFont}>
			<iconify-icon height="30px"  icon={$uisettings_store.term_fontbig?"mdi:format-font-size-decrease":"mdi:format-font-size-increase"}></iconify-icon>
		</a>
	</div>
</div>
