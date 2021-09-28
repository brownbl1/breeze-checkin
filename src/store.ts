import AsyncStorage from '@react-native-community/async-storage'
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import watch from 'redux-watch'
import { models, RootModel } from './models'

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
  )(() => {
    store.dispatch.events.selectEntrustEventAsync()
    store.dispatch.events.selectTeacherEventAsync()
    store.dispatch.events.selectDoctrine101EventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'settings.entrustEventId',
  )(() => {
    store.dispatch.events.selectEntrustEventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'settings.teacherEventId',
  )(() => {
    store.dispatch.events.selectTeacherEventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'settings.doctrine101EventId',
  )(() => {
    store.dispatch.events.selectDoctrine101EventAsync()
  }),
)

store.subscribe(
  watch(
    store.getState,
    'selected.person',
  )(() => {
    store.dispatch.selected.selectRelatedAsync()
  }),
)

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
