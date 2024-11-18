import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows continue game button when saved game exists', async () => {
    // Mock saved game
    localStorage.setItem('yatzyGameState', JSON.stringify({
      players: [{ name: 'Test', scores: {} }],
      gameStarted: true
    }))

    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Continue Game')
  })

  it('shows history button when games exist', async () => {
    // Mock game history
    localStorage.setItem('yatzyGameHistory', JSON.stringify([
      {
        timestamp: new Date().toISOString(),
        players: [{ name: 'Test', scores: {} }],
        winner: 'Test'
      }
    ]))

    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Show History')
  })
}) 