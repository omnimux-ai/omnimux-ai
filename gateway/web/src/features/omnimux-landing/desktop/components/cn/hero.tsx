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
import { useEffect, useRef, useState } from 'react'

import { useCopy } from '../../i18n'
import { REEL_MEDIA, type Mode } from './data'
import { useDownload } from './download-context'
import { usePrefersReducedMotion } from './hooks'
import { Icon } from './icons'
import { LazyVideo } from './lazy-video'

const REEL_LAYOUT = [
  { y: '44px', r: '-6deg' },
  { y: '18px', r: '-4deg' },
  { y: '5px', r: '-2deg' },
  { y: '0px', r: '0deg' },
  { y: '5px', r: '2deg' },
  { y: '18px', r: '4deg' },
  { y: '44px', r: '6deg' },
] as const

const TAB_ICONS = { agent: 'spark', video: 'video', image: 'img' } as const

export function CnHero() {
  const { open } = useDownload()
  const reduced = usePrefersReducedMotion()
  const copy = useCopy().hero
  const [mode, setMode] = useState<Mode>('agent')
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [typed, setTyped] = useState(copy.modes.agent.prompts[0])
  const [promptIndex, setPromptIndex] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const prompts = copy.modes[mode].prompts
  const full = prompts[promptIndex % prompts.length]

  useEffect(() => {
    if (reduced || value || focused) {
      setTyped(full)
      return
    }
    let count = 0
    let timer = window.setTimeout(function tick() {
      count += 1
      setTyped(full.slice(0, count))
      if (count < full.length) {
        timer = window.setTimeout(tick, 55)
      } else {
        timer = window.setTimeout(
          () => setPromptIndex((index) => index + 1),
          2600
        )
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [full, focused, reduced, value])

  const submit = () => open()

  return (
    <section className='hero' id='top'>
      <div className='hero-glow' aria-hidden='true' />
      <div className='wrap'>
        <h1 className='h1'>
          <span>{copy.titleA}</span>
          <span>{copy.titleB}</span>
        </h1>
        <p className='hero-sub'>
          {copy.subPre}
          <span className='nw'>{copy.subHighlight}</span>
          {copy.subPost}
        </p>

        <div className='hero-stack'>
          <div className='c-tabs' role='tablist' aria-label={copy.tabsAria}>
            {(['agent', 'video', 'image'] as const).map((item) => (
              <button
                key={item}
                type='button'
                role='tab'
                aria-selected={mode === item}
                onClick={() => {
                  setMode(item)
                  setPromptIndex(0)
                }}
              >
                <Icon name={TAB_ICONS[item]} />
                {copy.tabs[item]}
              </button>
            ))}
          </div>

          <form
            className='composer'
            autoComplete='off'
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label className='sr-only' htmlFor='cn-composer-input'>
              {copy.inputLabel}
            </label>
            <textarea
              id='cn-composer-input'
              ref={inputRef}
              rows={2}
              value={value}
              placeholder={typed}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  submit()
                }
              }}
            />
            <div className='c-bar'>
              <button
                type='button'
                className='c-tool c-tool-icon'
                aria-label={copy.attachAria}
              >
                <Icon name='plus' />
              </button>
              <button type='button' className='c-tool'>
                <Icon name='book' />
                {copy.skillsLabel}
              </button>
              <span className='c-spacer' />
              {copy.modes[mode].model ? (
                <span className='c-model'>{copy.modes[mode].model}</span>
              ) : null}
              <button type='submit' className='c-send' aria-label={copy.sendAria}>
                <Icon name='up' />
              </button>
            </div>
          </form>
        </div>

        <div className='skills' role='group' aria-label={copy.skillsAria}>
          {copy.skills.map((skill) => (
            <button
              key={skill.label}
              type='button'
              className='skill'
              onClick={() => {
                setValue(skill.fill)
                inputRef.current?.focus()
              }}
            >
              <Icon name={skill.icon} />
              {skill.label}
            </button>
          ))}
        </div>

        <div className='hero-dl'>
          <button
            className='btn btn-sm btn-primary'
            type='button'
            onClick={() => open('mac')}
          >
            <Icon name='apple' filled />
            {copy.dlMac}
          </button>
          <button
            className='btn btn-sm btn-ghost'
            type='button'
            onClick={() => open('win')}
          >
            <Icon name='win' filled />
            {copy.dlWin}
          </button>
        </div>
      </div>

      <div className='reel' aria-label={copy.reelAria}>
        {copy.reel.map((item, index) => {
          const layout = REEL_LAYOUT[index]
          const media = REEL_MEDIA[index]
          return (
            <figure
              key={item.title}
              className='reel-card'
              style={
                {
                  '--i': index,
                  '--y': layout.y,
                  '--r': layout.r,
                } as React.CSSProperties
              }
            >
              <LazyVideo src={media.src} poster={media.poster} />
              <figcaption>
                <b>{item.title}</b>
                <span>{item.tag}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
