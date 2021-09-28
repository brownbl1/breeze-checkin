import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { checkInPerson } from '../api'
import { Attendance } from './dataModel'

export type AttendanceState = {
  entrustAttendance: Attendance[]
  teacherAttendance: Attendance[]
  doctrine101Attendance: Attendance[]
}

export const attendance = createModel<RootModel>()({
  state: {
    entrustAttendance: [],
    teacherAttendance: [],
    doctrine101Attendance: [],
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
    setDoctrine101: (state, doctrine101Attendance: Attendance[]) => ({
      ...state,
      doctrine101Attendance,
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
    checkInDoctrine101Async: async (
      personId: string,
      { events: { doctrine101Event } },
    ) => {
      if (doctrine101Event?.id) {
        await checkInPerson(doctrine101Event.id, personId)
      }
    },
  }),
})
