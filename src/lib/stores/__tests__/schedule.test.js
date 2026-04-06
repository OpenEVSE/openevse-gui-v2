import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'

vi.mock('../../utils.js', () => ({
  httpAPI: vi.fn()
}))

import { schedule_store } from '../schedule.js'
import { httpAPI } from '../../utils.js'

describe('schedule_store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    schedule_store.set([])
  })

  it('should have all required methods', () => {
    expect(typeof schedule_store.subscribe).toBe('function')
    expect(typeof schedule_store.download).toBe('function')
    expect(typeof schedule_store.upload).toBe('function')
    expect(typeof schedule_store.remove).toBe('function')
  })

  it('should initialize with empty array', () => {
    const state = get(schedule_store)
    expect(state).toEqual([])
  })

  it('should download schedule and trim time seconds', async () => {
    const mockSchedule = [
      { id: 1, time: '08:00:00', days: ['mon', 'tue'] },
      { id: 2, time: '18:30:00', days: ['wed'] }
    ]
    httpAPI.mockResolvedValue(mockSchedule)

    const result = await schedule_store.download()
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('GET', '/schedule')

    const state = get(schedule_store)
    expect(state).toHaveLength(2)
    expect(state[0].time).toBe('08:00')
    expect(state[1].time).toBe('18:30')
  })

  it('should return false on download error', async () => {
    httpAPI.mockResolvedValue('error')
    const result = await schedule_store.download()
    expect(result).toBe(false)
  })

  it('should upload schedule data', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })
    const data = { time: '09:00', days: ['mon'] }
    const result = await schedule_store.upload(data)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('POST', '/schedule', JSON.stringify(data))
  })

  it('should return false on upload failure', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await schedule_store.upload({})
    expect(result).toBe(false)
  })

  it('should remove schedule by id', async () => {
    httpAPI.mockResolvedValue({ msg: 'done' })
    const result = await schedule_store.remove(1)
    expect(result).toBe(true)
    expect(httpAPI).toHaveBeenCalledWith('DELETE', '/schedule/1')
  })

  it('should return false on remove failure', async () => {
    httpAPI.mockResolvedValue({ msg: 'error' })
    const result = await schedule_store.remove(1)
    expect(result).toBe(false)
  })
})
