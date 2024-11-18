import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoreTable from '../ScoreTable.vue'

describe('ScoreTable', () => {
  const mockPlayers = [
    { name: 'Player 1', scores: {}, total: 0 },
    { name: 'Player 2', scores: {}, total: 0 }
  ]

  it('renders player names', () => {
    const wrapper = mount(ScoreTable, {
      props: {
        players: mockPlayers
      }
    })
    
    expect(wrapper.text()).toContain('Player 1')
    expect(wrapper.text()).toContain('Player 2')
  })

  it('calculates upper section sum correctly', async () => {
    const players = [{
      name: 'Test Player',
      scores: {
        'Ones': 3,
        'Twos': 6,
        'Threes': 9
      },
      total: 0
    }]

    const wrapper = mount(ScoreTable, {
      props: { players }
    })

    // Find the upper section sum cell
    const sumCell = wrapper.find('tr:nth-child(8)').findAll('td')[1]
    expect(sumCell.text()).toBe('18') // 3 + 6 + 9
  })

  it('shows bonus when upper section ≥ 63', async () => {
    const players = [{
      name: 'Test Player',
      scores: {
        'Ones': 5,
        'Twos': 10,
        'Threes': 15,
        'Fours': 20,
        'Fives': 25,
        'Sixes': 30
      },
      total: 0
    }]

    const wrapper = mount(ScoreTable, {
      props: { players }
    })

    const bonusCell = wrapper.find('tr:nth-child(10)').findAll('td')[1]
    expect(bonusCell.text()).toBe('50')
  })

  it('allows score input', async () => {
    const wrapper = mount(ScoreTable, {
      props: {
        players: mockPlayers
      }
    })

    // Click the first score cell
    const scoreCell = wrapper.find('tr:nth-child(3)').findAll('td')[1]
    await scoreCell.trigger('click')

    // Check if input appears
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
  })
}) 