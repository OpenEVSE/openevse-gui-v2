<script>
  import { uistates_store }   from "./../../../lib/stores/uistates.js";
  import { _ }                from 'svelte-i18n'
  import Box                  from "./../../ui/Box.svelte";
  import Borders              from "./../../ui/Borders.svelte";
  import Button               from "../../ui/Button.svelte"
  import IconButton           from "../../ui/IconButton.svelte"
  import SafetyTableRow       from "../../ui/SafetyTableRow.svelte";
  import SliderForm           from "../../ui/SliderForm.svelte";
	import CertificatesModal    from "./CertificatesModal.svelte";
	import { certificate_store }  from "../../../lib/stores/certificates.js"
	import { config_store } 	  from "./../../../lib/stores/config.js";
	import { serialQueue }      from "./../../../lib/queue.js";

  let certificates_modal_opened = false
  let removeCertificateState = ""

  // Heartbeat enable is derived from current (0 = disabled, sends $SY interval 0)
  // We keep a local non-zero current to restore when re-enabling
  let heartbeat_enabled = false
  let heartbeat_current_saved = 6

  $: {
    const cc = $config_store.heartbeat_current
    if (cc !== undefined) {
      heartbeat_enabled = cc > 0
      if (cc > 0) heartbeat_current_saved = cc
    }
  }

  function onHeartbeatToggle() {
    const current = heartbeat_enabled ? heartbeat_current_saved : 0
    serialQueue.add(() => config_store.saveParam("heartbeat_current", current))
  }

	async function removeCertificate(id) {
    let certificate = $certificate_store.findIndex(item => item.id === id)
    removeCertificateState = "loading"
    if (certificate > -1)
    {
      if(await serialQueue.add(() => certificate_store.remove(id)))
      {
        let config = { };
        [
          "mqtt_certitficate_id",
          "www_certitficate_id"
        ].forEach(key => {
          if ($config_store[key] == id) {
            config[key] = ""
          }
        });
        if (Object.keys(config).length > 0) {
          await serialQueue.add(() => config_store.upload(config));
        }
        $certificate_store.splice(certificate,1)
        $certificate_store = $certificate_store
        removeCertificateState = ""
      }
    }
  }

  function uploadCertificate() {
    certificates_modal_opened = true;
  }

</script>

<Box title={$_("config.titles.certificates")} icon="mdi:shield-lock" back={true}>

  <!-- Security Settings -->
  <table class="table is-fullwidth">
    <thead>
      <tr class="has-background-info">
        <th class="has-text-white">{$_("config.security.boot-lock-section")}</th>
        <th class="has-text-white has-text-centered is-capitalized">{$_("enabled")}</th>
      </tr>
    </thead>
    <tbody>
      <SafetyTableRow
        title={$_("config.security.boot-lock-enable")}
        name="boot_lock"
        bind:checked={$config_store.boot_lock}
        editable={true}
        onChange={() => serialQueue.add(() => config_store.saveParam("boot_lock", $config_store.boot_lock))}
      />
    </tbody>
    <thead>
      <tr class="has-background-info">
        <th class="has-text-white" colspan="2">{$_("config.security.heartbeat-section")}</th>
      </tr>
    </thead>
    <tbody>
      <SafetyTableRow
        title={$_("config.security.heartbeat-enable")}
        name="heartbeat"
        bind:checked={heartbeat_enabled}
        editable={true}
        onChange={onHeartbeatToggle}
      />
      {#if heartbeat_enabled}
      <tr>
        <td colspan="2" class="pt-3 pb-2">
          <SliderForm
            label={$_("config.security.heartbeat-fail-current")}
            bind:value={$config_store.heartbeat_current}
            min={6}
            max={24}
            step={1}
            unit={$_("units.A")}
            onchange={(val) => serialQueue.add(() => config_store.saveParam("heartbeat_current", val))}
          />
        </td>
      </tr>
      {/if}
    </tbody>
    <thead>
      <tr class="has-background-info">
        <th class="has-text-white">{$_("config.security.front-button-section")}</th>
        <th class="has-text-white has-text-centered is-capitalized">{$_("enabled")}</th>
      </tr>
    </thead>
    <tbody>
      <SafetyTableRow
        title={$_("config.security.front-button-enable")}
        name="front_button"
        bind:checked={$config_store.front_button}
        editable={true}
        onChange={()=>serialQueue.add(()=> config_store.saveParam("front_button", $config_store.front_button))}
      />
    </tbody>
  </table>

  <!-- Certificates -->
	<div class="my-2 is-flex is-justify-content-center is-align-items-center is-flex-direction-column" >
    <Borders>
      {#if $certificate_store.length}
			<table class="table is-size-6 has-text-weight-normal" >
        <thead>
          <tr>
            <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.id")}>{$_("config.certificates.id")}</abbr></th>
            <th class="has-text-centered has-text-dark"><abbr title={$_("config.certificates.type")}>{$_("config.certificates.type")}</abbr></th>
            <th class="has-text-centered has-text-dark"><abbr title="{$_("config.certificates.name")}">{$_("config.certificates.name")}</abbr></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {#each $certificate_store as item}
            <tr>
              <td class="has-text-dark">{ item.id }</td>
              <td class="has-text-dark">{ $_("config.certificates."+item.type) }</td>
              <td class="has-text-dark">{ item.name }</td>
              <td class="has-text-dark">
                <div class="delabs">
                  <div class="del">
                    <IconButton
                      icon="fa6-solid:xmark"
                      size="is-size-5"
                      state={removeCertificateState}
                      color="has-text-danger"
                      butn_submit={()=>{removeCertificate(item.id)}}
                    />
                  </div>
                </div>
              </td>
            </tr>
            {/each}
        </tbody>
      </table>
			{:else}
			<div class="content">{$_("config.certificates.empty")}</div>
			{/if}
    </Borders>
		<div class="mt-4">
      <Button name={$_("config.certificates.upload")} butn_submit={uploadCertificate}/>
    </div>
  </div>

</Box>

{#if certificates_modal_opened}
<CertificatesModal bind:is_opened={certificates_modal_opened} />
{/if}
