<script>
	let rapicommands = [
    {
      cmd: "G0",
      description: "get EV connect state",
      tokens: [
        { name: "connectstate",  description: "0=not connected, 1=connected, 2=unknown" }
      ]
    },
    {
      cmd: "G3",
      description: "get charging time limit",
      tokens: [
        { name: "cnt",  description: "cnt*15 = minutes<br/>= 0 = no time limit" }
      ]
    },
    {
      cmd: "G4",
      description: "get auth lock (needs AUTH_LOCK defined and AUTH_LOCK_REG undefined)",
      tokens: [
        { name: "lockstate",  description: "0=unlocked, 1=locked" }
      ]
    },
    {
      cmd: "GA",
      description: "get ammeter settings",
      tokens: [
        { name: "currentscalefactor",  description: "" },
        { name: "currentoffset",  description: "" }
      ]
    },
    {
      cmd: "GC",
      description: "get current capacity info, all values are decimal. <br/> n.b. maxamps,emaxamps values are dependent on the active service level (L1/L2)",
      tokens: [
        { name: "minamps",  description: "min allowed current capacity" },
        { name: "hmaxamps",  description: "max hardware allowed current capacity MAX_CURRENT_CAPACITY_Ln" },
        { name: "pilotamps",  description: "current capacity advertised by pilot" },
        { name: "cmaxamps",  description: "max configured allowed current capacity (saved to EEPROM)" }
      ]
    },
    {
      cmd: "GD",
      description: "get Delay timer, all values decimal, if timer disabled, starthr=startmin=endhr=endmin=0",
      tokens: [
        { name: "starthr",  description: "" },
        { name: "startmin",  description: "" },
        { name: "endhr",  description: "" },
        { name: "endmin",  description: "" }
      ]
    },
    {
      cmd: "GE",
      description: "get settings",
      tokens: [
        { name: "amps",  description: "(decimal)" },
        { name: "flags", description: "(hex)" }
      ]
    },
    {
      cmd: "GF",
      description: "get fault counters, all values hex, maximum trip count = 0xFF for any counter",
      tokens: [
        { name: "gfitripcnt",  description: "" },
        { name: "nogndtripcnt",  description: "" },
        { name: "stuckrelaytripcnt",  description: "" }
      ]
    },
    {
      cmd: "GG",
      description: "get charging current and voltage.  AMMETER must be defined in order to get amps, otherwise returns -1 amps",
      tokens: [
        { name: "milliamps",  description: "" },
        { name: "millivolts",  description: "" }
      ]
    },
    {
      cmd: "GH",
      description: "get cHarge limit",
      tokens: [
        { name: "kWh",  description: "0 = no charge limit" }
      ]
    },
    {
      cmd: "GI",
      description: "get MCU ID - requires MCU_ID_LEN to be defined. <br/> n.b. MCU_ID_LEN must be defined in order to get MCU ID WARNING: mcuid is guaranteed to be unique only for the 328PB. Uniqueness is unknown in 328P. The first 6 characters are ASCII, and the rest are hexadecimal.",
      tokens: [
        { name: "mcuid",  description: "AVR serial number, mcuid is 6 ASCII characters followed by 4 hex digits. First hex digit = FF for 328P" }
      ]
    },
    {
      cmd: "GM",
      description: "get voltMeter settings",
      tokens: [
        { name: "voltcalefactor",  description: "" },
        { name: "voltoffset",  description: "" }
      ]
    },
    {
      cmd: "GO",
      description: "get Overtemperature thresholds, thresholds are in 10ths of a degree Celcius",
      tokens: [
        { name: "ambientthresh",  description: "" },
        { name: "irthresh",  description: "" }
      ]
    },
    {
      cmd: "GP",
      description: "get temPerature (v1.0.3+),  all temperatures are in 10th's of a degree Celcius<br/>if any temperature sensor is not installed, its return value is -2560",
      tokens: [
        { name: "ds3231temp",  description: "temperature from DS3231 RTC" },
        { name: "mcp9808temp",  description: "temperature from MCP9808" },
        { name: "tmp007temp",  description: "temperature from TMP007" }
      ]
    },
    {
      cmd: "GS",
      description: "get state",
      tokens: [
        { name: "evsestate", description: "(hex), EVSE_STATE_xxx"},
        { name: "elapsed",  description: "(dec), elapsed charge time in seconds of current or last charging session" },
        { name: "pilotstate", description: "(hex), EVSE_STATE_xxx"},
        { name: "vflags",  description: "(hex), EVCF_xxx" }
		]
	},
    {
      cmd: "GT",
      description: "get time (RTC)",
      tokens: [
        { name: "yr",  description: "2-digit year" },
        { name: "mo",  description: "" },
        { name: "day",  description: "" },
        { name: "hr",  description: "" },
        { name: "min",  description: "" },
        { name: "sec",  description: "" }
      ]
    },
    {
      cmd: "GU",
      description: "get energy usage (v1.0.3+)",
      tokens: [
        { name: "Wattseconds",  description: "Watt-seconds used this charging session, note you'll divide Wattseconds by 3600 to get Wh" },
        { name: "Whacc",  description: "total Wh accumulated over all charging sessions, note you'll divide Wh by 1000 to get kWh" }
      ]
    },
    {
      cmd: "GV",
      description: "get version",
      tokens: [
        { name: "firmware_version",  description: "" },
        { name: "protocol_version",  description: "protocol_version is deprecated. too hard to maintain variants, ignore it, and test commands for compatibility, instead." }
      ]
    },
    {
      cmd: "GY",

      description: "Get Hearbeat Supervision Status",
      tokens: [
        { name: "heartbeatinterval",  description: "" },
        { name: "hearbeatcurrentlimit",  description: "" },
        { name: "hearbeattrigger",  description: "0 - There has never been a missed pulse, <br/>2 - there is a missed pulse, and HS is still in current limit<br/>1 - There was a missed pulse once, but it has since been acknkoledged. Ampacity has been successfully restored to max permitted " }
      ]
    }
  ];
</script>
<div class="is-size-7">
	<div class="container">
		<h4>RAPI GET Commands</h4>
		<table>
			<tr>
				<th class="has-text-info">Get</th>
				<th class="has-text-info">Description</th>
			</tr>
			{#each rapicommands as rapi}
			<tr>
				<td class="has-text-weight-bold">${rapi.cmd}</td>
				<td>
					<div class="has-text-weight-bold">{rapi.description}</div>
					<div>
						{#each rapi.tokens as token}
						<div class="has-text-aligned-left">{token.name}</div>
						<div class="has-text-aligned-right">{token.description}</div>
						{/each}
					</div>
				</td>
			</tr>
			{/each}
		</table>
	</div>
	
	<div class="container">
		<h2>RAPI Set Commands</h2>
		<table class="has-text-weight-bold">
		<tr>
			<th class="has-text-info">Set</th>
			<th class="has-text-info">Description</th>
		</tr>
		<tr>
			<td>$S0</td>
			<td>Set LCD Type, Monochrome (0), Color (1)</td>
		</tr>
		<tr>
			<td>$S1</td>
			<td>Set RTC, year month day hour minute second (all 2-digit max)</td>
		</tr>
		<tr>
			<td>$S2</td>
			<td>Enable (1)/ Disable (0) Ammeter Calibration Mode</td>
		</tr>
		<tr>
			<td>$S3</td>
			<td>Set Charge Time Limit, 15-minutes (1), 30-minutes (2), etc...</td>
		</tr>
		<tr>
			<td>$SA</td>
			<td>Set Ammeter Scale/Offset, scale offset</td>
		</tr>
		<tr>
			<td>$SC</td>
			<td>Set current capacity, integer</td>
		</tr>
		<tr>
			<td>$SH</td>
			<td>Set charge limit in kWh, integer</td>
		</tr>
		<tr>
			<td>$SK</td>
			<td>Set accumulated Wh, integer</td>
		</tr>
		<tr>
			<td>$SL</td>
			<td>Set service level (1/2/A)</td>
		</tr>
		<tr>
			<td>$SM</td>
			<td>Set Voltmeter Scale/Offset, scale offset</td>
		</tr>
		<tr>
			<td>$ST</td>
			<td>Set timer, start_hour start_min end_hour end_min</td>
		</tr>
		<tr>
			<td>$SV</td>
			<td>Set voltage for power calculations, millivolts</td>
		</tr>
		</table>
	</div>
	<div class="mt-4 container">
		<h2>RAPI System Functions</h2>
		<table class="has-text-weight-bold">
		<tr>
			<th class="has-text-info">Function</th>
			<th class="has-text-info">Description</th>
		</tr>
		<tr>
			<td>$FB</td>
			<td>LCD Backlight Color (0-7)</td>
		</tr>
		<tr>
			<td>$FD</td>
			<td>Disable EVSE</td>
		</tr>
		<tr>
			<td>$FE</td>
			<td>Enable EVSE</td>
		</tr>
		<tr>
			<td>$FP</td>
			<td>Output text at x y position text to LCD (x y text)</td>
		</tr>
		<tr>
			<td>$FR</td>
			<td>Reset EVSE</td>
		</tr>
		<tr>
			<td>$FS</td>
			<td>Put EVSE to sleep</td>
		</tr>
		<tr>
			<td>$FF</td>
			<td>Enable/disable feature (feature_id 0|1)<br>
				<div class="has-text-weight-normal"> Front panel (B)utton, (D)iode check, G(F)I self-test, (G)round check,
				Stuck (R)elay check, (T)emp monitoring, (V)ent required</div>
			</td>
		</tr>
		</table>
	</div>
</div>