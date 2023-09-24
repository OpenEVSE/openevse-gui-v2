<script>
  import { uistates_store }   from "./../../../lib/stores/uistates.js";
  import { _ }                from 'svelte-i18n'
  import Box                  from "./../../ui/Box.svelte";
  import Borders              from "./../../ui/Borders.svelte";
  import SelectFile           from "./../../ui/SelectFile.svelte";
  import Button               from "../../ui/Button.svelte"
	import Select               from "./../../ui/Select.svelte";
	import InputForm            from "./../../ui/InputForm.svelte";
  import { serialQueue }      from "./../../../lib/queue.js";
  import { httpAPI }          from "../../../lib/utils.js"
	import { onMount }          from "svelte"

  let certificates = [];

  let formdata = {
    type: {val: undefined,  input: undefined, status: "", req: true},
    name: {val: undefined,  input: undefined, status: "", req: true},
    private_key: {val: undefined,  input: undefined, status: "", req: true},
    certificate: {val: undefined,  input: undefined, status: "", req: true}
  }

  async function init() {
    certificates = await serialQueue.add(() => httpAPI("GET","/certificates"))
  }

  onMount(()=>{
    init()
  })

</script>

<Box title={$_("config.titles.certificates")} icon="mdi:certificate" back={true}>
  <div class="table-container is-flex-grow-1 is-flex is-justify-content-center" style="overflow: visible;">
    <table class="table is-size-7-mobile is-size-6 is-fullwidth has-text-dark">
      <thead>
        <tr>
          <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.id")}>{$_("config.certificates.id")}</abbr></th>
          <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.type")}>{$_("config.certificates.type")}</abbr></th>
          <th class="has-text-centered has-text-dark"><abbr title="{$_("config.certificates.name")}">{$_("config.certificates.name")}</abbr></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
          {#each certificates as item}
          <tr>
            <td class="has-text-dark">{ item.id }</td>
            <td class="has-text-dark">{ $_("config.certificates."+item.type) }</td>
            <td class="has-text-dark">{ item.name }</td>
            <td class="has-text-dark">
              <Button icon="mdi:delete"></Button>
            </td>
          </tr>
          {/each}
      </tbody>
    </table>
  </div>

  <div class="is-flex is-align-items-center is-justify-content-center px-6-tablet">
    <Borders grow>
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
            multiline=true
            bind:this={formdata.certificate.input}
            bind:value={formdata.certificate.val} placeholder="-----BEGIN CERTIFICATE-----..." 
            bind:status={formdata.certificate.status}
          />
        </div>
        
        {#if "client" === formdata.type.val}
        <div>
          <InputForm 
            title="{$_("config.certificates.private_key")}*" 
            multiline=true
            bind:this={formdata.private_key.input}
            bind:value={formdata.private_key.val} placeholder="-----BEGIN RSA PRIVATE KEY-----..." 
            bind:status={formdata.private_key.status}
          />
        </div>
        {/if}
        
        <div>
          <Button name={$_("config.certificates.add")} />
        </div>
      </div>

    </Borders>
  </div>

</Box>
