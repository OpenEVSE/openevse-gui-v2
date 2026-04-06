import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { uistates_store } from '../uistates.js'

describe('uistates_store', () => {
  beforeEach(() => {
    // Reset to default state before each test
    uistates_store.set({
      charge_current: undefined,
      shaper: undefined,
      autorelease: true,
      time_lmt: 0,
      charge_lmt: 0,
      config_version: 0,
      claims_version: 0,
      override_version: 0,
      schedule_version: 0,
      schedule_plan_version: 0,
      limit_version: 0,
      logidx_min: 0,
      logidx_max: 0,
      mode: undefined,
      charging: false,
      stateclaimfrom: null,
      time_localestring: null,
      error: false,
      error_desc: '',
      data_loaded: false,
      ws_connected: true,
      status_expanded: false,
      breakpoint: undefined,
      has_fetched: false,
      wizard_step: 0,
      vehicle_state_update: 0,
      divert_update: 0,
      rfid_waiting: 0,
      elapsed: 0,
      alertbox: {
        title: undefined,
        body: undefined,
        visible: false,
        button: false,
        closable: true,
        component: undefined,
        action: () => {},
      },
      networks: []
    })
  })

  it('should have subscribe method', () => {
    expect(typeof uistates_store.subscribe).toBe('function')
  })

  it('should have set method', () => {
    expect(typeof uistates_store.set).toBe('function')
  })

  it('should have update method', () => {
    expect(typeof uistates_store.update).toBe('function')
  })

  it('should have resetAlertBox method', () => {
    expect(typeof uistates_store.resetAlertBox).toBe('function')
  })

  it('should have setObject method', () => {
    expect(typeof uistates_store.setObject).toBe('function')
  })

  it('should initialize with default values', () => {
    const state = get(uistates_store)
    expect(state.charging).toBe(false)
    expect(state.has_fetched).toBe(false)
    expect(state.ws_connected).toBe(true)
    expect(state.wizard_step).toBe(0)
    expect(state.networks).toEqual([])
    expect(state.autorelease).toBe(true)
  })

  it('should initialize alertbox with default values', () => {
    const state = get(uistates_store)
    expect(state.alertbox.visible).toBe(false)
    expect(state.alertbox.button).toBe(false)
    expect(state.alertbox.closable).toBe(true)
    expect(state.alertbox.title).toBeUndefined()
    expect(state.alertbox.body).toBeUndefined()
    expect(state.alertbox.component).toBeUndefined()
  })

  it('should reset alert box', () => {
    // First modify the alertbox
    uistates_store.update(state => {
      state.alertbox.title = 'Test Error'
      state.alertbox.body = 'Error description'
      state.alertbox.visible = true
      return state
    })

    let state = get(uistates_store)
    expect(state.alertbox.visible).toBe(true)
    expect(state.alertbox.title).toBe('Test Error')

    // Reset it
    uistates_store.resetAlertBox()

    state = get(uistates_store)
    expect(state.alertbox.visible).toBe(false)
    expect(state.alertbox.title).toBeUndefined()
    expect(state.alertbox.body).toBeUndefined()
    expect(state.alertbox.closable).toBe(true)
  })

  it('should set nested object with setObject', () => {
    const newAlertBox = {
      title: 'New Alert',
      body: 'Alert body',
      visible: true,
      button: true,
      closable: false,
      component: undefined,
      action: () => {},
    }

    uistates_store.setObject('alertbox', newAlertBox)

    const state = get(uistates_store)
    expect(state.alertbox.title).toBe('New Alert')
    expect(state.alertbox.body).toBe('Alert body')
    expect(state.alertbox.visible).toBe(true)
    expect(state.alertbox.button).toBe(true)
    expect(state.alertbox.closable).toBe(false)
  })

  it('should update state values', () => {
    uistates_store.update(state => {
      state.charging = true
      state.mode = 1
      state.has_fetched = true
      return state
    })

    const state = get(uistates_store)
    expect(state.charging).toBe(true)
    expect(state.mode).toBe(1)
    expect(state.has_fetched).toBe(true)
  })

  it('should set networks list', () => {
    uistates_store.setObject('networks', ['network1', 'network2'])
    const state = get(uistates_store)
    expect(state.networks).toEqual(['network1', 'network2'])
  })
})
