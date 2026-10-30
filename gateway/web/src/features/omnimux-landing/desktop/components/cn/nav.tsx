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
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useIsSidebarModuleVisible } from '@/hooks/use-sidebar-config'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

import { LANDING_LANGS, useLanding } from '../../i18n'
import { TOOL_PATHS } from '../../tools/content'
import { CnAccountMenu } from './account-menu'
import type { IconName } from './data'
import { useDownload } from './download-context'
import { Icon } from './icons'
import { CnLangMenu } from './lang-menu'
import { CnSignOutDialog } from './sign-out'

export type CnNavLinkKey =
  | 'home'
  | 'models'
  | 'tools'
  | 'forAI'
  | 'ext'
  | 'pricing'

type NavLinkMeta = {
  href: string
  key: CnNavLinkKey
  icon?: IconName
  route?: boolean
}

const LINK_META: readonly NavLinkMeta[] = [
  { href: '#top', key: 'home' },
  { href: '#models', key: 'models' },
  { href: '#tools', key: 'tools' },
  { href: '#surfaces', key: 'forAI' },
  { href: '#ext', key: 'ext', icon: 'puzzle' },
  { href: '/pricing', key: 'pricing', route: true },
]

/**
 * `anchorBase` prefixes the in-page anchors so pages other than the homepage
 * (the tool pages pass `/`) link back to the homepage sections; `current`
 * marks the active entry.
 */
export function CnNav(props: { anchorBase?: string; current?: CnNavLinkKey }) {
  const anchorBase = props.anchorBase ?? ''
  const current = props.current ?? 'home'
  const anchorHref = (href: string) => {
    if (!anchorBase || href.startsWith('/')) return href
    return href === '#top' ? anchorBase : `${anchorBase}${href}`
  }
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const { open, downloadDirect } = useDownload()
  const user = useAuthStore((state) => state.auth.user)
  const isWalletVisible = useIsSidebarModuleVisible('/wallet')
  const isSecurityVisible = useIsSidebarModuleVisible('/security')
  const isSuperAdmin = user?.role === ROLE.SUPER_ADMIN
  const { lang, setLang, copy } = useLanding()
  const nav = copy.nav
  const linkLabel = (key: CnNavLinkKey) => nav[key]
  const toolsMenu = nav.toolsMenu
  const toolLocale: 'en' | 'zh-CN' =
    lang === 'zh-CN' || lang === 'zh-TW' ? 'zh-CN' : 'en'
  const toolLinks = [
    {
      href: TOOL_PATHS[toolLocale].video,
      label: toolsMenu.video,
      icon: 'video' as IconName,
    },
    {
      href: TOOL_PATHS[toolLocale].photo,
      label: toolsMenu.photo,
      icon: 'img' as IconName,
    },
  ]
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortalRoot(document.querySelector<HTMLElement>('.omc'))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className='nav-in'>
          <a
            className='brand'
            href={anchorHref('#top')}
            aria-label={nav.brandAria}
          >
            <img src='/logo.svg' alt='' />
            <b>OmniMux</b>
            <small>{nav.brand}</small>
          </a>
          <nav className='nav-links' aria-label={nav.navAria}>
            {LINK_META.map((link) => {
              if (link.route) {
                return (
                  <Link key={link.key} to='/pricing'>
                    {linkLabel(link.key)}
                  </Link>
                )
              }
              if (link.key === 'tools') {
                return (
                  <MenuPrimitive.Root key={link.key} modal={false}>
                    <MenuPrimitive.Trigger
                      render={
                        <button
                          type='button'
                          aria-current={
                            current === 'tools' ? 'page' : undefined
                          }
                        />
                      }
                    >
                      {linkLabel(link.key)}
                      <svg
                        className='ico ico-caret'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path d='m6 9 6 6 6-6' />
                      </svg>
                    </MenuPrimitive.Trigger>
                    {portalRoot && (
                      <MenuPrimitive.Portal container={portalRoot}>
                        <MenuPrimitive.Positioner
                          className='cn-menupos'
                          align='start'
                          side='bottom'
                          sideOffset={10}
                        >
                          <MenuPrimitive.Popup
                            className='cn-usermenu cn-toolsmenu'
                            aria-label={toolsMenu.aria}
                          >
                            <div className='cn-toolsmenu-group'>
                              {toolsMenu.group}
                            </div>
                            {toolLinks.map((tool) => (
                              <MenuPrimitive.Item
                                key={tool.href}
                                className='cn-item'
                                render={
                                  <Link to={tool.href}>
                                    <Icon name={tool.icon} />
                                    {tool.label}
                                  </Link>
                                }
                              />
                            ))}
                          </MenuPrimitive.Popup>
                        </MenuPrimitive.Positioner>
                      </MenuPrimitive.Portal>
                    )}
                  </MenuPrimitive.Root>
                )
              }
              return (
                <a
                  key={link.key}
                  href={anchorHref(link.href)}
                  aria-current={link.key === current ? 'page' : undefined}
                >
                  {link.icon ? <Icon name={link.icon} /> : null}
                  {linkLabel(link.key)}
                </a>
              )
            })}
          </nav>
          <div className='nav-end'>
            <CnLangMenu />
            <button
              className='btn btn-sm btn-ghost'
              type='button'
              onClick={() => {
                if (!downloadDirect()) open()
              }}
            >
              <Icon name='dl' />
              <span>{nav.download}</span>
            </button>
            {user ? (
              <CnAccountMenu onSignOut={() => setSignOutOpen(true)} />
            ) : (
              <Link className='btn btn-sm btn-ghost login' to='/sign-in'>
                {nav.login}
              </Link>
            )}
            <button
              className='menu-btn'
              type='button'
              aria-label={nav.menuOpen}
              aria-expanded={sheetOpen}
              aria-controls='cn-sheet'
              onClick={() => setSheetOpen((value) => !value)}
            >
              <Icon name='menu' />
            </button>
          </div>
        </div>
      </header>
      <div className={`sheet${sheetOpen ? ' open' : ''}`} id='cn-sheet'>
        {LINK_META.map((link) => {
          if (link.key !== 'tools') {
            return (
              <a
                key={link.key}
                href={anchorHref(link.href)}
                onClick={() => setSheetOpen(false)}
              >
                {linkLabel(link.key)}
              </a>
            )
          }
          return (
            <div className='sheet-group' key={link.key}>
              <span className='sheet-group-h'>{toolsMenu.group}</span>
              {toolLinks.map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  onClick={() => setSheetOpen(false)}
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          )
        })}
        {user ? (
          <>
            <Link to='/influencer' onClick={() => setSheetOpen(false)}>
              {nav.account.dashboard}
            </Link>
            <Link to='/profile' onClick={() => setSheetOpen(false)}>
              {nav.account.profile}
            </Link>
            {isSecurityVisible && (
              <Link to='/security' onClick={() => setSheetOpen(false)}>
                {nav.account.security}
              </Link>
            )}
            {isWalletVisible && (
              <Link to='/wallet' onClick={() => setSheetOpen(false)}>
                {nav.account.wallet}
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                to='/system-settings/site/$section'
                params={{ section: 'system-info' }}
                onClick={() => setSheetOpen(false)}
              >
                {nav.account.systemSettings}
              </Link>
            )}
            <button
              type='button'
              className='sheet-signout'
              onClick={() => {
                setSheetOpen(false)
                setSignOutOpen(true)
              }}
            >
              {nav.account.signOut}
            </button>
          </>
        ) : (
          <Link to='/sign-in' onClick={() => setSheetOpen(false)}>
            {nav.login}
          </Link>
        )}
        <div className='sheet-langs' role='group' aria-label={nav.langTitle}>
          {LANDING_LANGS.map((option) => (
            <button
              key={option.code}
              type='button'
              className={option.code === lang ? 'on' : undefined}
              lang={option.htmlLang}
              onClick={() => setLang(option.code)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <CnSignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
