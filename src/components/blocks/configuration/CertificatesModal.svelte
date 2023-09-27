<script>
  import { _ }                from 'svelte-i18n'
  import Box                  from "../../ui/Box.svelte";
  import Borders              from "../../ui/Borders.svelte";
  import Button               from "../../ui/Button.svelte"
	import Select               from "../../ui/Select.svelte";
	import InputForm            from "../../ui/InputForm.svelte";
  import { serialQueue }      from "../../../lib/queue.js";
  import Modal                from "../..//ui/Modal.svelte";
	import { certificate_store } from "../../../lib/stores/certificates.js"
	import { validateFormData } from "./../../../lib/utils.js";
  import { uistates_store }   from "./../../../lib/stores/uistates.js";
  import { get }              from 'svelte/store'

  export let is_opened = false;

  let formdata = {
    type: {val: undefined,  input: undefined, status: "", req: true},
    name: {val: undefined,  input: undefined, status: "", req: true},
    private_key: {val: undefined,  input: undefined, status: "", req: true},
    certificate: {val: undefined,  input: undefined, status: "", req: true}
  }

	let saveCertificateState = ""
  let timeout

  function alert(msg) {
    get(uistates_store).alertbox.title = "error"
    get(uistates_store).alertbox.body = msg
    get(uistates_store).alertbox.visible = true
  }

  async function saveCertificate()
  {
    saveCertificateState = "loading";

    formdata.private_key.req = formdata.type.val === "client";
    let valid = validateFormData({data: formdata, i18n_path: "config.certificates.missing-", req: true});
    if (!valid.ok) {
      saveCertificateState = "error";
      alert(valid.msg)
      return;
    }

    let certificate = {
      name: formdata.name.val,
      certificate: formdata.certificate.val
    };
    if (formdata.type.val === "client") {
      certificate.key = formdata.private_key.val;
    }
    let res = await serialQueue.add(() => certificate_store.upload(certificate));
    if(res.success)
    {
      saveCertificateState = "ok";
      certificate.type = formdata.type.val;
      certificate.id = res.id;
      $certificate_store.push(certificate)
      timeout = setTimeout(() => {
        is_opened = false 
      }, 500)
    } else {
      saveCertificateState = "error";
      alert(res.msg)
    }
    $certificate_store = $certificate_store
  }

</script>

<Modal fit bind:is_opened>

  <Box title={$_("config.titles.certificates")} icon="mdi:certificate">
    <div class="is-flex is-align-items-center is-justify-content-center px-6-tablet">
      <div class="has-text-centered">
        <div class="">
          <Select
            items={[
              { name: $_("config.certificates.root"), value: "root" },
              { name: $_("config.certificates.client"), value: "client" }
            ]}
            title={$_("config.certificates.type")}
            bind:this={formdata.type.input}
            bind:value={formdata.type.val}
            bind:status={formdata.type.status}
          />

          <InputForm
            is_inline size={30}
            title="{$_("config.certificates.name")}*"
            placeholder="{$_("config.certificates.name_placeholder")}"
            bind:this={formdata.name.input}
            bind:value={formdata.name.val}
            bind:status={formdata.name.status}
          />
        </div>

        <div>
          <InputForm
            title="{$_("config.certificates.certificate")}*"
            multiline monospace
            bind:this={formdata.certificate.input}
            bind:value={formdata.certificate.val} placeholder="-----BEGIN CERTIFICATE-----..."
            bind:status={formdata.certificate.status}
          />
        </div>

        {#if "client" === formdata.type.val}
        <div>
          <InputForm
            title="{$_("config.certificates.private_key")}*"
            multiline monospace
            bind:this={formdata.private_key.input}
            bind:value={formdata.private_key.val} placeholder="-----BEGIN RSA PRIVATE KEY-----..."
            bind:status={formdata.private_key.status}
          />
        </div>
        {/if}
      </div>
    </div>
		<div class="mt-4 is-flex is-justify-content-center mb-4">
			<Button name={$_("save")} color="is-info"  butn_submit={saveCertificate} state={saveCertificateState} />
			<Button name={$_("cancel")} color="is-danger" butn_submit={()=>is_opened = false} />
		</div>

  </Box>

</Modal>