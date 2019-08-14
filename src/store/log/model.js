import { format } from 'date-fns'

export const getInstance = () => ({
  id: null,
  when: format(new Date(), 'YYYY-MM-DD'),
  action: '',
  what: '',
  where: null,
  how: null,
  with: null,
  tags: []
})
