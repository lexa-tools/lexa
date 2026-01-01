/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

export async function loadView(viewId, file) {
  const container = document.getElementById(viewId)
  if (container.dataset.loaded) return
  const res = await fetch(`views/${file}`)
  container.innerHTML = await res.text()
  container.dataset.loaded = "true"
}

export function setupSidebar(viewMap, onViewActivated) {
  document.querySelectorAll('.sidebar__nav-item[data-view]')
    .forEach(item => {
      item.addEventListener('click', async () => {
        const target = item.dataset.view
        await loadView(target, viewMap[target])
        document.querySelectorAll('.main__view')
          .forEach(v => v.classList.remove('main__view--active'))
        document.getElementById(target).classList.add('main__view--active')

        // Sidebar icon update
        document.querySelectorAll('.sidebar__nav-item i')
          .forEach(i => { i.classList.remove('sidebar__icon--active'); i.classList.add('sidebar__icon') })
        item.querySelector('i').classList.add('sidebar__icon--active')
        item.querySelector('i').classList.remove('sidebar__icon')

        onViewActivated(target)
      })
    })
}

// Load overview view on open
export function loadOverview(viewMap) {
  document.addEventListener('DOMContentLoaded', async () => {
    const defaultView = 'view-overview'
    await fetch(`views/${viewMap[defaultView]}`)
      .then(res => res.text())
      .then(html => document.getElementById(defaultView).innerHTML = html)
    document.getElementById(defaultView).classList.add('main__view--active')
  })
}