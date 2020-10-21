import { createModel } from '@rematch/core'
import { Printer } from 'expo-print'
import moment from 'moment'
import { setSettings, Settings } from '../helpers/getSettings'
import { RootModel } from './models'

export const settings = createModel<RootModel>()({
  state: {
    date: null,
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
      dispatch.settings.setAll(settings)
      await dispatch.events.selectAsync()
    },
    setPrinterAsync: async (printer: Printer, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, printer })
      dispatch.settings.setPrinter(printer)
    },
    setDateAsync: async (date: Date, rootState) => {
      const { settings } = rootState
      const d = moment(date).format('M/D/YYYY')
      await setSettings({ ...settings, date: d })
      dispatch.settings.setDate(d)

      if (settings.entrustEventId && settings.teacherEventId)
        await dispatch.events.selectAsync()
    },
    setEntrustEventIdAsync: async (entrustEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, entrustEventId })
      dispatch.settings.setEntrustEventId(entrustEventId)

      if (settings.date && settings.teacherEventId)
        await dispatch.events.selectAsync()
    },
    setTeacherEventIdAsync: async (teacherEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, teacherEventId })
      dispatch.settings.setTeacherEventId(teacherEventId)

      if (settings.date && settings.entrustEventId)
        await dispatch.events.selectAsync()
    },
  }),
})
