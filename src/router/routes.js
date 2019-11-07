
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/calendar',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', component: () => import('pages/Calendar.vue') }
    ]
  },
  {
    path: '/tags',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', component: () => import('pages/TagList'), meta: { title: 'Tags' } },
      { path: 'new', component: () => import('pages/TagForm'), props: true, meta: { title: 'New Tag' } },
      { path: ':id', component: () => import('pages/TagForm'), props: true, meta: { title: 'Edit Tag' } }
    ]
  },
  {
    path: '/occurrences',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', component: () => import('pages/OccurrenceList'), meta: { title: 'Occurrences' } },
      { path: 'new', component: () => import('pages/OccurrenceForm'), props: true, meta: { title: 'New Occurrence' } },
      { path: ':id', component: () => import('pages/OccurrenceForm'), props: true, meta: { title: 'Edit Occurrence' } }
    ]
  },
  {
    path: '/tasks',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', component: () => import('pages/TaskList'), meta: { title: 'Tasks' } },
      { path: 'new', component: () => import('pages/TaskForm'), props: true, meta: { title: 'New Task' } },
      { path: ':id', component: () => import('pages/TaskForm'), props: true, meta: { title: 'Edit Task' } }
    ]
  },
  {
    path: '/logs',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', component: () => import('pages/LogList'), meta: { title: 'Logs' } },
      { path: 'new', component: () => import('pages/LogForm'), props: true, meta: { title: 'New Log' } },
      { path: ':id', component: () => import('pages/LogForm'), props: true, meta: { title: 'Edit Log' } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
