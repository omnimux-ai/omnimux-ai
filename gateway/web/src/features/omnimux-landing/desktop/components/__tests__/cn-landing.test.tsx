/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { zhCN } from '../../i18n/locales/zh-CN'
import {
  DOWNLOAD_MAC_ARM64,
  DOWNLOAD_MAC_X64,
  DOWNLOAD_WIN,
} from '../cn/data'
import { CnFaq } from '../cn/faq'
import { CnHero } from '../cn/hero'
import { CnProof } from '../cn/proof'

afterEach(cleanup)

describe('desktop CN landing', () => {
  it('renders every FAQ entry', () => {
    const { container } = render(<CnFaq />)
    const items = container.querySelectorAll('details')
    expect(items).toHaveLength(zhCN.faq.items.length)
    expect(screen.getByText('怎么复刻竞品的爆款视频？')).toBeTruthy()
  })

  it('states product facts without invented traction numbers', () => {
    const { container } = render(<CnProof />)
    // Read the copy instead of pinning literals: the platform count must stay
    // the length of the badge list beside it, not a second hand-kept number.
    for (const fact of zhCN.proof.facts) {
      expect(screen.getByText(fact.value)).toBeTruthy()
    }
    expect(zhCN.proof.facts.at(-1)?.value).toBe(
      String(zhCN.proof.platforms.length)
    )
    expect(container.textContent).not.toMatch(/50万\+|1000万\+|官方认证/)
  })
})

describe('desktop CN hero composer', () => {
  it('shows no model hint for Agent but keeps the parameter hint for video and image', async () => {
    const user = userEvent.setup()
    const { container } = render(<CnHero />)
    const hint = () => container.querySelector('.c-model')

    expect(hint()).toBeNull()

    await user.click(screen.getByRole('tab', { name: zhCN.hero.tabs.video }))
    expect(hint()?.textContent).toBe(zhCN.hero.modes.video.model)

    await user.click(screen.getByRole('tab', { name: zhCN.hero.tabs.image }))
    expect(hint()?.textContent).toBe(zhCN.hero.modes.image.model)

    await user.click(screen.getByRole('tab', { name: zhCN.hero.tabs.agent }))
    expect(hint()).toBeNull()
  })
})

describe('desktop CN hero split download', () => {
  const openMenu = async () => {
    const user = userEvent.setup()
    render(<CnHero />)
    const caret = screen.getByRole('button', { name: zhCN.hero.dlMenuAria })
    await user.click(caret)
    return { user, caret }
  }

  it('toggles the menu via the caret and exposes three installer links', async () => {
    const { user, caret } = await openMenu()

    expect(caret).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('menu')
    expect(menu).toBeTruthy()

    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveAttribute('href', DOWNLOAD_MAC_ARM64)
    expect(items[1]).toHaveAttribute('href', DOWNLOAD_MAC_X64)
    expect(items[2]).toHaveAttribute('href', DOWNLOAD_WIN)

    await user.click(caret)
    expect(caret).toHaveAttribute('aria-expanded', 'false')
  })

  it('labels each menu item with the variant name and requirement note', async () => {
    await openMenu()
    const items = screen.getAllByRole('menuitem')
    expect(items[0].textContent).toContain(zhCN.hero.dlMacArm)
    expect(items[0].textContent).toContain(zhCN.hero.dlMacArmNote)
    expect(items[1].textContent).toContain(zhCN.hero.dlMacIntel)
    expect(items[1].textContent).toContain(zhCN.hero.dlMacIntelNote)
    expect(items[2].textContent).toContain(zhCN.hero.dlWinX64)
    expect(items[2].textContent).toContain(zhCN.hero.dlWinX64Note)
  })

  it('closes the menu on Escape', async () => {
    const { user, caret } = await openMenu()
    await user.keyboard('{Escape}')
    expect(caret).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the menu on an outside pointerdown', async () => {
    const { user, caret } = await openMenu()
    // The listener lives on document; a pointerdown outside .split-dl must
    // dismiss it even when the click lands on the page body.
    await user.click(document.body)
    expect(caret).toHaveAttribute('aria-expanded', 'false')
  })

  it('main button defaults to the arm64 build when detection has not run', () => {
    render(<CnHero />)
    const main = document.querySelector<HTMLAnchorElement>('.split-main')
    expect(main?.getAttribute('href')).toBe(DOWNLOAD_MAC_ARM64)
    expect(main?.textContent).toBe(zhCN.hero.dlMac)
  })
})
