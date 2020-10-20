import { createModel } from '@rematch/core'
import { Attendance } from './dataModel'
import { RootModel } from './models'

type TeacherAttendanceState = Attendance[]

export const teacherAttendance = createModel<RootModel>()({
  state: [] as TeacherAttendanceState,
  reducers: {
    set: (_, attendance: Attendance[]) => attendance,
  },
})
