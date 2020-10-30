import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { checkInPerson } from '../api'
import { Attendance } from './dataModel'

export type AttendanceState = {
  entrustAttendance: Attendance[]
  teacherAttendance: Attendance[]
}

export const attendance = createModel<RootModel>()({
  state: {
    entrustAttendance: [],
    teacherAttendance: [],
  } as AttendanceState,
  reducers: {
    setEntrust: (state, entrustAttendance: Attendance[]) => ({
      ...state,
      entrustAttendance,
    }),
    setTeacher: (state, teacherAttendance: Attendance[]) => ({
      ...state,
      teacherAttendance,
    }),
  },
  effects: () => ({
    checkInChildAsync: async (personId: string, { events: { entrustEvent } }) => {
      if (entrustEvent?.id) {
        await checkInPerson(entrustEvent.id, personId)
      }
    },
    checkInTeacherAsync: async (personId: string, { events: { teacherEvent } }) => {
      if (teacherEvent?.id) {
        await checkInPerson(teacherEvent.id, personId)
      }
    },
  }),
})
