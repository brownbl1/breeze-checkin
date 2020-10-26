import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import AsyncStorage from '@react-native-community/async-storage'
import watch from 'redux-watch'

import { models, RootModel } from './models/models'

export const store = init<RootModel>({
  models,
  plugins: [
    persistPlugin({
      key: 'settings',
      storage: AsyncStorage,
      whitelist: ['settings'],
    }),
  ],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>

const watchDate = watch(store.getState, 'settings.date')
const watchEntrustEventId = watch(store.getState, 'settings.entrustEventId')
const watchTeacherEventId = watch(store.getState, 'settings.teacherEventId')

store.subscribe(
  watchDate((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectEntrustEventAsync()
    store.dispatch.events.selectTeacherEventAsync()
  }),
)

store.subscribe(
  watchEntrustEventId((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectEntrustEventAsync()
  }),
)

store.subscribe(
  watchTeacherEventId((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectTeacherEventAsync()
  }),
)
