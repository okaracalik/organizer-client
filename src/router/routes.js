
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Calendar', component: () => import('pages/Calendar.vue') }
    ]
  },
  {
    path: '/calendar',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name: 'Calendar', component: () => import('pages/Calendar'), meta: { title: 'Calendar' } }
    ]
  },
  {
    path: '/tags',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name: 'Tags', component: () => import('pages/TagList'), meta: { title: 'Tags' } },
      { path: 'new', name: 'NewTag', component: () => import('pages/TagForm'), props: true, meta: { title: 'New Tag' } },
      { path: ':id', name: 'EditTag', component: () => import('pages/TagForm'), props: true, meta: { title: 'Edit Tag' } }
    ]
  },
  {
    path: '/occurrences',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name: 'Occurrences', component: () => import('pages/OccurrenceList'), meta: { title: 'Occurrences' } },
      { path: 'new', name: 'NewOccurrence', component: () => import('pages/OccurrenceForm'), props: true, meta: { title: 'New Occurrence' } },
      { path: ':id', name: 'EditOccurrence', component: () => import('pages/OccurrenceForm'), props: true, meta: { title: 'Edit Occurrence' } }
    ]
  },
  {
    path: '/tasks',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name: 'Tasks', component: () => import('pages/TaskList'), meta: { title: 'Tasks' } },
      { path: 'new', name: 'NewTask', component: () => import('pages/TaskForm'), props: true, meta: { title: 'New Task' } },
      { path: ':id', name: 'EditTask', component: () => import('pages/TaskForm'), props: true, meta: { title: 'Edit Task' } }
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
