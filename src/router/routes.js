
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/tags',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', component: () => import('pages/TagList'), meta: { title: 'Tags' } },
      { path: 'new', component: () => import('pages/TagForm'), props: true, meta: { title: 'New Tag' } },
      { path: ':id', component: () => import('pages/TagForm'), props: true, meta: { title: 'Edit Tag' } }
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
