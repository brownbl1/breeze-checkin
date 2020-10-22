import { createModel } from '@rematch/core'
import { Printer } from 'expo-print'
import moment from 'moment'

import { setSettings, Settings } from '../helpers/settings'
import { RootModel } from './models'

export const settings = createModel<RootModel>()({
  state: {
    date: null,
    dayOfWeek: null,
    numParentTags: null,
    entrustEventId: null,
    teacherEventId: null,
    printer: {
      name: null,
      url: null,
    },
  } as Settings,
  reducers: {
    setAll: (_, settings: Settings) => settings,
    setPrinter: (state, printer: Printer) => ({
      ...state,
      printer,
    }),
    setDow: (state, dayOfWeek: number) => ({
      ...state,
      date: null,
      entrustEventId: null,
      teacherEventId: null,
      dayOfWeek,
    }),
    setNumParentTags: (state, numParentTags: number) => ({
      ...state,
      numParentTags,
    }),
    setDate: (state, date: string) => ({
      ...state,
      date,
    }),
    setEntrustEventId: (state, entrustEventId: string) => ({
      ...state,
      entrustEventId,
    }),
    setTeacherEventId: (state, teacherEventId: string) => ({
      ...state,
      teacherEventId,
    }),
  },
  effects: (dispatch) => ({
    setAllAsync: async (settings: Settings) => {
      await setSettings(settings)
      dispatch.settings.setAll(settings)
      if (settings.date && (settings.entrustEventId || settings.teacherEventId))
        await dispatch.events.selectAsync()
    },
    setPrinterAsync: async (printer: Printer, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, printer })
      dispatch.settings.setPrinter(printer)
    },
    setDowAsync: async (dayOfWeek: number, rootState) => {
      const { settings } = rootState
      await setSettings({
        ...settings,
        date: null,
        entrustEventId: null,
        teacherEventId: null,
        dayOfWeek,
      })
      dispatch.settings.setDow(dayOfWeek)
      dispatch.events.clear()
    },
    setNumParentTagsAsync: async (numParentTags: number, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, numParentTags })
      dispatch.settings.setNumParentTags(numParentTags)
    },
    setDateAsync: async (date: Date, rootState) => {
      const { settings } = rootState
      const d = moment(date).format('M/D/YYYY')
      await setSettings({
        ...settings,
        date: d,
      })
      dispatch.settings.setDate(d)
      dispatch.events.clear()

      if (settings.date && settings.entrustEventId && settings.teacherEventId)
        await dispatch.events.selectAsync()
    },
    setEntrustEventIdAsync: async (entrustEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, entrustEventId })
      dispatch.settings.setEntrustEventId(entrustEventId)

      if (settings.date) await dispatch.events.selectAsync()
    },
    setTeacherEventIdAsync: async (teacherEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, teacherEventId })
      dispatch.settings.setTeacherEventId(teacherEventId)

      if (settings.date) await dispatch.events.selectAsync()
    },
  }),
})
