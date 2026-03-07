import { describe, it, expect, beforeEach } from 'vitest'
import { portal } from '../portal.js'

describe('portal', () => {
  let sourceElement
  let targetElement

  beforeEach(() => {
    document.body.innerHTML = ''
    sourceElement = document.createElement('div')
    targetElement = document.createElement('div')
    targetElement.id = 'target'
    document.body.appendChild(targetElement)
  })

  it('should move children to target element', () => {
    const child1 = document.createElement('span')
    child1.textContent = 'child1'
    const child2 = document.createElement('span')
    child2.textContent = 'child2'
    sourceElement.appendChild(child1)
    sourceElement.appendChild(child2)

    portal(sourceElement, targetElement)

    expect(targetElement.children).toHaveLength(2)
    expect(targetElement.children[0].textContent).toBe('child1')
    expect(targetElement.children[1].textContent).toBe('child2')
  })

  it('should accept a CSS selector string as target', () => {
    const child = document.createElement('span')
    child.textContent = 'ported'
    sourceElement.appendChild(child)

    portal(sourceElement, '#target')

    expect(targetElement.children).toHaveLength(1)
    expect(targetElement.children[0].textContent).toBe('ported')
  })

  it('should throw error when target element is not found', () => {
    expect(() => {
      portal(sourceElement, '#nonexistent')
    }).toThrow('Target element not found/undefined.')
  })

  it('should throw error when target is null', () => {
    expect(() => {
      portal(sourceElement, null)
    }).toThrow('Target element not found/undefined.')
  })

  it('should remove children on destroy', () => {
    const child = document.createElement('span')
    child.textContent = 'removable'
    sourceElement.appendChild(child)

    const result = portal(sourceElement, targetElement)
    expect(targetElement.children).toHaveLength(1)

    result.destroy()
    expect(targetElement.children).toHaveLength(0)
  })

  it('should handle source with no children', () => {
    const result = portal(sourceElement, targetElement)
    expect(targetElement.children).toHaveLength(0)
    result.destroy()
    expect(targetElement.children).toHaveLength(0)
  })
})
