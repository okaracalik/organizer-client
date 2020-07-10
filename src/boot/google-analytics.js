/* eslint-disable no-undef */
// import something here
import ga from '../services/analytics.js'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ router }/* { app, router, Vue ... } */) => {
  // something to do
  router.afterEach((to, from) => {
    ga.logPage(to.path, to.name)
  })
}
