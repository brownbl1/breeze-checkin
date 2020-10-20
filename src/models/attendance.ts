import { createModel } from '@rematch/core'
import { Attendance } from './dataModel'
import { RootModel, baseUrl, options } from './models'

export type AttendanceState = Attendance[]

export const attendance = createModel<RootModel>()({
  state: [] as AttendanceState,
  reducers: {
    set: (_, attendance: Attendance[]) => attendance,
  },
  effects: (dispatch) => ({
    fetchAsync: async (eventId: string, { event }) => {
      const attendanceProm = fetch(
        `${baseUrl}/api/events/attendance/list?instance_id=${eventId}`,
        options,
      )
        .then((res) => res.json())
        .catch(() => []) as Promise<Attendance[]>

      const teacherAttendanceProm = fetch(
        `${baseUrl}/api/events/attendance/list?instance_id=${event.teacherId}`,
        options,
      )
        .then((res) => res.json())
        .catch(() => []) as Promise<Attendance[]>

      const [attendance, teacherAttendance] = await Promise.all([
        attendanceProm,
        teacherAttendanceProm,
      ])

      dispatch.attendance.set(attendance)
      dispatch.teacherAttendance.set(teacherAttendance)
    },
    checkInAsync: async (personId: string, { event: { event } }) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${event.id}`,
        options,
      )
    },
    checkInTeacherAsync: async (personId: string, { event: { teacherId } }) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${teacherId}`,
        options,
      )
    },
  }),
})
