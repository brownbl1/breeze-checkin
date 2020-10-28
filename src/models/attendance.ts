import { createModel } from '@rematch/core'
import { checkInPerson } from '../api'
import { Attendance } from './dataModel'
import { RootModel } from './models'

export type AttendanceState = {
  entrustAttendance: Attendance[] | null
  teacherAttendance: Attendance[] | null
}

export const attendance = createModel<RootModel>()({
  state: {
    entrustAttendance: null,
    teacherAttendance: null,
  } as AttendanceState,
  reducers: {
    set: (_, attendance: AttendanceState) => attendance,
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
