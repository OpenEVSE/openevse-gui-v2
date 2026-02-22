import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock svelte-i18n
vi.mock('svelte-i18n', () => {
  const mockTranslate = (key) => key
  mockTranslate.subscribe = (fn) => { fn(mockTranslate); return () => {} }
  return { _: mockTranslate }
})

// Mock svelte/store get
vi.mock('svelte/store', async () => {
  const actual = await vi.importActual('svelte/store')
  return {
    ...actual,
    get: vi.fn((store) => {
      // If it's the i18n _ store, return a translation function
      if (store && typeof store === 'function') return (key) => key
      if (store && store._mockValue !== undefined) return store._mockValue
      // Default mock values for stores
      return {
        has_fetched: false,
        tesla_enabled: false,
        mqtt_vehicle_range_miles: false,
        ipaddress: '192.168.1.1',
        wizard_step: 0,
        alertbox: { title: undefined, body: undefined, visible: false }
      }
    })
  }
})

// Mock the stores
vi.mock('../stores/uistates.js', () => ({
  uistates_store: {
    subscribe: vi.fn(),
    update: vi.fn((fn) => fn({ has_fetched: false })),
    _mockValue: {
      has_fetched: false,
      alertbox: { title: undefined, body: undefined, visible: false }
    }
  }
}))

vi.mock('../stores/config.js', () => ({
  config_store: {
    subscribe: vi.fn(),
    upload: vi.fn(() => Promise.resolve(true)),
    _mockValue: {
      tesla_enabled: false,
      mqtt_vehicle_range_miles: false
    }
  }
}))

vi.mock('../stores/status.js', () => ({
  status_store: {
    subscribe: vi.fn(),
    _mockValue: { ipaddress: '192.168.1.1' }
  }
}))

vi.mock('../stores/limit.js', () => ({
  limit_store: {
    subscribe: vi.fn(),
    _mockValue: { type: 'time' }
  }
}))

vi.mock('../queue.js', () => ({
  default: {
    add: vi.fn((fn) => fn()),
    pause: vi.fn(),
    resume: vi.fn()
  },
  serialQueue: {
    add: vi.fn((fn) => fn()),
    pause: vi.fn(),
    resume: vi.fn()
  }
}))

import {
  sec2time,
  formatDate,
  displayTime,
  getTZ,
  createTzObj,
  round,
  temp_round,
  getBreakpoint,
  clientid2name,
  type2icon,
  dedup,
  s2mns,
  miles2km,
  isFloat,
  isInteger,
  JSONTryParse,
  compareVersion,
  removeDuplicateObjects,
  validateFormData,
} from '../utils.js'

describe('sec2time', () => {
  it('should format 0 seconds', () => {
    expect(sec2time(0)).toBe('00:00:00')
  })

  it('should handle null/undefined input', () => {
    expect(sec2time(null)).toBe('00:00:00')
    expect(sec2time(undefined)).toBe('00:00:00')
  })

  it('should format seconds only', () => {
    expect(sec2time(45)).toBe('00:00:45')
  })

  it('should format minutes and seconds', () => {
    expect(sec2time(125)).toBe('00:02:05')
  })

  it('should format hours, minutes, and seconds', () => {
    expect(sec2time(3661)).toBe('01:01:01')
  })

  it('should format large hours', () => {
    expect(sec2time(36000)).toBe('10:00:00')
  })

  it('should handle exactly one hour', () => {
    expect(sec2time(3600)).toBe('01:00:00')
  })

  it('should handle exactly one minute', () => {
    expect(sec2time(60)).toBe('00:01:00')
  })
})

describe('round', () => {
  it('should round to 0 decimal places by default', () => {
    expect(round(1.5)).toBe(2)
    expect(round(1.4)).toBe(1)
  })

  it('should round to specified precision', () => {
    expect(round(1.456, 2)).toBe(1.46)
    expect(round(1.454, 2)).toBe(1.45)
  })

  it('should round to 1 decimal place', () => {
    expect(round(1.55, 1)).toBe(1.6)
    expect(round(1.54, 1)).toBe(1.5)
  })

  it('should handle negative numbers', () => {
    expect(round(-1.5)).toBe(-1)
    expect(round(-1.6)).toBe(-2)
  })

  it('should handle zero', () => {
    expect(round(0)).toBe(0)
    expect(round(0, 2)).toBe(0)
  })

  it('should handle null precision (same as 0)', () => {
    expect(round(3.7, null)).toBe(4)
  })
})

describe('temp_round', () => {
  it('should divide by 10 and round to 1 decimal place', () => {
    expect(temp_round(255)).toBe(25.5)
    expect(temp_round(300)).toBe(30)
  })

  it('should return empty string for NaN', () => {
    expect(temp_round(NaN)).toBe('')
    expect(temp_round('abc')).toBe('')
  })

  it('should handle zero', () => {
    expect(temp_round(0)).toBe(0)
  })

  it('should handle negative values', () => {
    expect(temp_round(-100)).toBe(-10)
  })
})

describe('isFloat', () => {
  it('should return true for float numbers', () => {
    expect(isFloat(1.5)).toBe(true)
    expect(isFloat(0.1)).toBe(true)
    expect(isFloat(-2.3)).toBe(true)
  })

  it('should return false for integers', () => {
    expect(isFloat(1)).toBe(false)
    expect(isFloat(0)).toBe(false)
    expect(isFloat(-5)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isFloat('1.5')).toBe(false)
    expect(isFloat(null)).toBe(false)
    expect(isFloat(undefined)).toBe(false)
  })
})

describe('isInteger', () => {
  it('should return true for integers', () => {
    expect(isInteger(1)).toBe(true)
    expect(isInteger(0)).toBe(true)
    expect(isInteger(-5)).toBe(true)
  })

  it('should return false for floats', () => {
    expect(isInteger(1.5)).toBe(false)
    expect(isInteger(0.1)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isInteger('1')).toBe(false)
    expect(isInteger(null)).toBe(false)
    expect(isInteger(undefined)).toBe(false)
  })
})

describe('JSONTryParse', () => {
  it('should parse valid JSON objects', () => {
    expect(JSONTryParse('{"key": "value"}')).toEqual({ key: 'value' })
    expect(JSONTryParse('{"a": 1, "b": 2}')).toEqual({ a: 1, b: 2 })
  })

  it('should return false for invalid JSON', () => {
    expect(JSONTryParse('not json')).toBe(false)
    expect(JSONTryParse('{bad json}')).toBe(false)
  })

  it('should return false for null/undefined/empty', () => {
    expect(JSONTryParse(null)).toBe(false)
    expect(JSONTryParse(undefined)).toBe(false)
    expect(JSONTryParse('')).toBe(false)
  })

  it('should return false for JSON arrays (not objects)', () => {
    expect(JSONTryParse('[1,2,3]')).toBe(false)
  })

  it('should return false for JSON primitives', () => {
    expect(JSONTryParse('"string"')).toBe(false)
    expect(JSONTryParse('42')).toBe(false)
    expect(JSONTryParse('true')).toBe(false)
  })

  it('should parse nested objects', () => {
    const input = '{"outer": {"inner": "value"}}'
    expect(JSONTryParse(input)).toEqual({ outer: { inner: 'value' } })
  })
})

describe('compareVersion', () => {
  it('should return 1 when last is newer', () => {
    expect(compareVersion('1.1.0', 'v1.0.0')).toBe(1)
    expect(compareVersion('2.0.0', 'v1.9.9')).toBe(1)
    expect(compareVersion('v1.0.1', 'v1.0.0')).toBe(1)
  })

  it('should return -1 when last is older', () => {
    expect(compareVersion('1.0.0', 'v1.1.0')).toBe(-1)
    expect(compareVersion('v1.0.0', 'v2.0.0')).toBe(-1)
  })

  it('should return 0 when versions are equal', () => {
    expect(compareVersion('v1.0.0', 'v1.0.0')).toBe(0)
    expect(compareVersion('1.2.3', 'v1.2.3')).toBe(0)
  })

  it('should return 0 for non-string inputs', () => {
    expect(compareVersion(null, 'v1.0.0')).toBe(0)
    expect(compareVersion('1.0.0', null)).toBe(0)
    expect(compareVersion(123, 'v1.0.0')).toBe(0)
  })

  it('should return 0 when old does not start with v', () => {
    expect(compareVersion('1.0.0', '1.0.0')).toBe(0)
  })

  it('should handle different length versions', () => {
    expect(compareVersion('v1.0.0.1', 'v1.0.0')).toBe(1)
    expect(compareVersion('v1.0', 'v1.0.0')).toBe(-1)
  })
})

describe('miles2km', () => {
  it('should convert miles to kilometers', () => {
    expect(miles2km(1)).toBeCloseTo(1.60934, 4)
    expect(miles2km(0)).toBe(0)
    expect(miles2km(100)).toBeCloseTo(160.934, 2)
  })

  it('should handle negative values', () => {
    expect(miles2km(-1)).toBeCloseTo(-1.60934, 4)
  })
})

describe('s2mns', () => {
  it('should format seconds to HH:MM:SS', () => {
    expect(s2mns(0)).toBe('00:00:00')
    expect(s2mns(61)).toBe('00:01:01')
    expect(s2mns(3661)).toBe('01:01:01')
  })

  it('should handle large values', () => {
    expect(s2mns(36000)).toBe('10:00:00')
  })
})

describe('dedup', () => {
  it('should remove duplicate primitives', () => {
    expect(dedup([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('should remove duplicate objects', () => {
    const arr = [
      { a: 1, b: 2 },
      { a: 1, b: 2 },
      { a: 2, b: 3 }
    ]
    expect(dedup(arr)).toEqual([{ a: 1, b: 2 }, { a: 2, b: 3 }])
  })

  it('should return empty array for empty input', () => {
    expect(dedup([])).toEqual([])
  })

  it('should return same array if no duplicates', () => {
    expect(dedup([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should remove duplicate strings', () => {
    expect(dedup(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })
})

describe('removeDuplicateObjects', () => {
  it('should remove objects with duplicate key values', () => {
    const arr = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 1, name: 'duplicate' }
    ]
    const result = removeDuplicateObjects(arr, 'id')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('first')
    expect(result[1].name).toBe('second')
  })

  it('should return empty array for empty input', () => {
    expect(removeDuplicateObjects([], 'id')).toEqual([])
  })

  it('should keep all items if no duplicates', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' }
    ]
    expect(removeDuplicateObjects(arr, 'id')).toHaveLength(2)
  })

  it('should keep first occurrence when duplicates found', () => {
    const arr = [
      { id: 1, val: 'first' },
      { id: 1, val: 'second' },
      { id: 1, val: 'third' }
    ]
    const result = removeDuplicateObjects(arr, 'id')
    expect(result).toHaveLength(1)
    expect(result[0].val).toBe('first')
  })
})

describe('clientid2name', () => {
  it('should return client name for known id', () => {
    expect(clientid2name(65537)).toBe('manual')
    expect(clientid2name(65538)).toBe('divert')
    expect(clientid2name(65539)).toBe('boost')
    expect(clientid2name(65540)).toBe('timer')
    expect(clientid2name(65542)).toBe('limit')
    expect(clientid2name(65543)).toBe('error')
    expect(clientid2name(65544)).toBe('ohm')
    expect(clientid2name(65545)).toBe('ocpp')
    expect(clientid2name(65546)).toBe('rfid')
    expect(clientid2name(65547)).toBe('mqtt')
    expect(clientid2name(65548)).toBe('shaper')
  })

  it('should return null for unknown id', () => {
    expect(clientid2name(99999)).toBe('null')
    expect(clientid2name(0)).toBe('null')
  })
})

describe('type2icon', () => {
  it('should return correct icon for information', () => {
    expect(type2icon('information')).toBe('fa6-solid:circle-info')
  })

  it('should return correct icon for notification', () => {
    expect(type2icon('notification')).toBe('fa6-solid:bell')
  })

  it('should return correct icon for warning', () => {
    expect(type2icon('warning')).toBe('fa6-solid:triangle-exclamation')
  })

  it('should return undefined for unknown type', () => {
    expect(type2icon('unknown')).toBeUndefined()
  })
})

describe('getTZ', () => {
  it('should extract timezone from pipe-separated string', () => {
    expect(getTZ('America/New_York|EST')).toBe('America/New_York')
    expect(getTZ('Europe/London|GMT')).toBe('Europe/London')
  })

  it('should return UTC for falsy input', () => {
    expect(getTZ(null)).toBe('UTC')
    expect(getTZ(undefined)).toBe('UTC')
    expect(getTZ('')).toBe('UTC')
  })

  it('should return full string if no pipe separator', () => {
    expect(getTZ('UTC')).toBe('UTC')
  })
})

describe('createTzObj', () => {
  it('should create timezone objects excluding Etc timezones', () => {
    const tzData = {
      'America/New_York': 'EST',
      'Etc/GMT': 'GMT',
      'Europe/London': 'GMT'
    }
    const result = createTzObj(tzData)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'America/New_York',
      value: 'America/New_York|EST'
    })
    expect(result[1]).toEqual({
      name: 'Europe/London',
      value: 'Europe/London|GMT'
    })
  })

  it('should return empty array for empty input', () => {
    expect(createTzObj({})).toEqual([])
  })

  it('should filter out all Etc timezones', () => {
    const tzData = {
      'Etc/GMT': 'GMT',
      'Etc/UTC': 'UTC',
      'Etc/GMT+5': 'EST'
    }
    const result = createTzObj(tzData)
    expect(result).toHaveLength(0)
  })
})

describe('getBreakpoint', () => {
  it('should return mobilemini for small widths', () => {
    Object.defineProperty(window, 'innerWidth', { value: 400, writable: true })
    expect(getBreakpoint()).toBe('mobilemini')
  })

  it('should return mobile for medium-small widths', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
    expect(getBreakpoint()).toBe('mobile')
  })

  it('should return tablet for medium widths', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    expect(getBreakpoint()).toBe('tablet')
  })

  it('should return desktop for large widths', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true })
    expect(getBreakpoint()).toBe('desktop')
  })

  it('should return mobilemini at boundary (410)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 410, writable: true })
    expect(getBreakpoint()).toBe('mobilemini')
  })

  it('should return mobile at boundary (411)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 411, writable: true })
    expect(getBreakpoint()).toBe('mobile')
  })

  it('should return tablet at boundary (641)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 641, writable: true })
    expect(getBreakpoint()).toBe('tablet')
  })

  it('should return desktop at boundary (1281)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1281, writable: true })
    expect(getBreakpoint()).toBe('desktop')
  })
})

describe('validateFormData', () => {
  it('should return ok for valid data with no required fields', () => {
    const data = {
      field1: { val: 'test', req: false }
    }
    const result = validateFormData({ data, i18n_path: 'test.' })
    expect(result.ok).toBe(true)
    expect(result.data.field1).toBe('test')
  })

  it('should include non-password values in result data', () => {
    const data = {
      name: { val: 'myname', req: false },
      host: { val: 'localhost', req: false }
    }
    const result = validateFormData({ data, i18n_path: 'test.' })
    expect(result.ok).toBe(true)
    expect(result.data.name).toBe('myname')
    expect(result.data.host).toBe('localhost')
  })

  it('should exclude password fields with hidden password marker', () => {
    const data = {
      pass: { val: '••••••••••', req: false, pwd: true }
    }
    const result = validateFormData({ data, i18n_path: 'test.' })
    expect(result.ok).toBe(true)
    expect(result.data.pass).toBeUndefined()
  })

  it('should include password fields with actual value', () => {
    const data = {
      pass: { val: 'realpassword', req: false, pwd: true }
    }
    const result = validateFormData({ data, i18n_path: 'test.' })
    expect(result.ok).toBe(true)
    expect(result.data.pass).toBe('realpassword')
  })

  it('should fail validation for required empty field when req flag is true', () => {
    const mockSetValue = vi.fn()
    const data = {
      username: { val: '', req: true, input: { setValue: mockSetValue } }
    }
    const result = validateFormData({ data, i18n_path: 'config.errors.', req: true })
    expect(result.ok).toBe(false)
  })
})
