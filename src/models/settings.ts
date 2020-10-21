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
      dispatch.event.selectAsync(settings.date)
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

      if (settings.entrustEventId) dispatch.event.selectAsync(d)
    },
    setEntrustEventIdAsync: async (entrustEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, entrustEventId })
      dispatch.settings.setEntrustEventId(entrustEventId)
    },
    setTeacherEventIdAsync: async (teacherEventId: string, rootState) => {
      const { settings } = rootState
      await setSettings({ ...settings, teacherEventId })
      dispatch.settings.setTeacherEventId(teacherEventId)
    },
  }),
})
