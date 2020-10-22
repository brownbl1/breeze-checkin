import { createModel } from '@rematch/core'
import { Attendance } from './dataModel'
import { RootModel, baseUrl, options } from './models'

export type AttendanceState = {
  entrustAttendance: Attendance[]
  teacherAttendance: Attendance[]
}

export const attendance = createModel<RootModel>()({
  state: {
    entrustAttendance: null,
    teacherAttendance: null,
  } as AttendanceState,
  reducers: {
    set: (_, attendance: AttendanceState) => attendance,
  },
  effects: (dispatch) => ({
    checkInChildAsync: async (
      personId: string,
      { events: { entrustEvent } },
    ) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${entrustEvent.id}`,
        options,
      )
    },
    checkInTeacherAsync: async (
      personId: string,
      { events: { teacherEvent } },
    ) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${teacherEvent.id}`,
        options,
      )
    },
  }),
})
