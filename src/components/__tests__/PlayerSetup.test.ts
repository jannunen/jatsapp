import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayerSetup from '../PlayerSetup.vue'

describe('PlayerSetup', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('adds a player when form is submitted', async () => {
    const wrapper = mount(PlayerSetup)
    
    // Set player name
    const input = wrapper.find('input')
    await input.setValue('Test Player')
    
    // Click add player button
    const addButton = wrapper.find('button:nth-child(2)')
    await addButton.trigger('click')
    
    // Check if player is added to the list
    expect(wrapper.text()).toContain('Test Player')
  })

  it('emits players-added event when starting game', async () => {
    const wrapper = mount(PlayerSetup)
    
    // Add two players
    const input = wrapper.find('input')
    await input.setValue('Player 1')
    await wrapper.find('button:nth-child(2)').trigger('click')
    await input.setValue('Player 2')
    await wrapper.find('button:nth-child(2)').trigger('click')
    
    // Start game
    const startButton = wrapper.find('button:last-child')
    await startButton.trigger('click')
    
    // Check emitted event
    expect(wrapper.emitted('players-added')).toBeTruthy()
    expect(wrapper.emitted('players-added')[0][0]).toEqual(['Player 1', 'Player 2'])
  })

  it('disables start button when no players added', () => {
    const wrapper = mount(PlayerSetup)
    const startButton = wrapper.find('button:last-child')
    expect(startButton.attributes('disabled')).toBeDefined()
  })
}) 