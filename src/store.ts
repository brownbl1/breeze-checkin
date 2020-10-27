import AsyncStorage from '@react-native-community/async-storage'
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import persistPlugin from '@rematch/persist'
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

store.subscribe(
  watch(
    store.getState,
    'settings.date',
  )((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectEntrustEventAsync()
    store.dispatch.events.selectTeacherEventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'settings.entrustEventId',
  )((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectEntrustEventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'settings.teacherEventId',
  )((newVal, oldVal, path) => {
    console.log('%s changed from %s to %s', path, oldVal, newVal)

    store.dispatch.events.selectTeacherEventAsync()
  }),
)

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
