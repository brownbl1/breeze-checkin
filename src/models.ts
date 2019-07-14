import { API_KEY, EVENT_ID, TEACHER_EVENT_ID } from './env'
import moment from 'moment'
import { setEvent } from './helpers/getEvent'
import { createModel } from '@rematch/core'

const baseUrl = 'https://crosswaypa.breezechms.com'
const options = {
  headers: { 'Api-key': API_KEY },
}
const placeholder = require('./assets/gray.png')

let attendanceInterval

const mapPerson = ({ id, first_name, last_name, path }) => ({
  id,
  key: id,
  first_name,
  last_name,
  name: `${first_name} ${last_name}`.trim(),
  path,
  source: path.includes('generic')
    ? placeholder
    : { uri: `${baseUrl}/${path}` },
})

export const selectedChild = createModel({
  state: null,
  reducers: {
    select: (_, child) => child,
  },
  effects: dispatch => ({
    selectAsync: async child => {
      dispatch.printDetails.set(null)
      dispatch.selectedChild.select(child)
      dispatch.selectedChildRelationships.fetchRelationshipsAsync(child.id)
    },
  }),
})

export const selectedChildRelationships = createModel({
  state: null,
  reducers: {
    set: (_, relationships) => relationships,
    toggleChecked: (state, id) =>
      state.map(person => {
        const { details, ...restPerson } = person
        if (details.id !== id) {
          return person
        }

        const { checked, ...restDetails } = details
        return {
          details: {
            checked: !checked,
            ...restDetails,
          },
          ...restPerson,
        }
      }),
  },
  effects: dispatch => ({
    fetchRelationshipsAsync: async personId => {
      dispatch.selectedChildRelationships.set(null)

      const { family } = await fetch(
        `${baseUrl}/api/people/${personId}`,
        options
      ).then(res => res.json())

      const withDetails = family.map(({ details, ...rest }) => ({
        details: mapPerson(details),
        ...rest,
      }))

      dispatch.selectedChildRelationships.set(withDetails)
      dispatch.printDetails.fetchAsync(family)
    },
  }),
})

const getSpouse = (spouse, headId) => {
  if (spouse && spouse.person_id !== headId) {
    return fetch(`${baseUrl}/api/people/${spouse.person_id}`, options).then(
      res => res.json()
    )
  }

  return Promise.resolve(null)
}

export const printDetails = createModel({
  state: { head: null, children: [], parents: [] },
  reducers: {
    set: (_, details) => details,
  },
  effects: dispatch => ({
    fetchAsync: async family => {
      dispatch.printDetails.set(null)

      const head = family.find(({ role_id }) => role_id === '4') // head of household
      const spouse = family.find(({ role_id }) => role_id === '5') // spouse
      const adult = family.find(({ role_id }) => role_id === '3') // adult

      const { person_id: headId } = head || spouse || adult

      const headPromise = fetch(
        `${baseUrl}/api/people/${headId}`,
        options
      ).then(res => res.json())

      const spousePromise = getSpouse(spouse, headId)

      const childrenPromise = Promise.all(
        family
          .filter(({ role_id }) => role_id === '2') // child
          .map(({ person_id }) =>
            fetch(`${baseUrl}/api/people/${person_id}`, options).then(res =>
              res.json()
            )
          )
      )

      const [headJson, spouseJson, children] = await Promise.all([
        headPromise,
        spousePromise,
        childrenPromise,
      ])

      const parents = spouseJson ? [headJson, spouseJson] : [headJson]
      dispatch.printDetails.set({ head: headJson, children, parents })
    },
  }),
})

export const teachers = createModel({
  state: [],
  reducers: {
    set: (_, teachers) => teachers,
  },
  effects: dispatch => ({
    setAsync: async eventId => {
      const json = await fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${eventId}`,
        options
      ).then(res => res.json())

      dispatch.teachers.set(json)
    },
  }),
})

export const event = createModel({
  state: { event: null, teacherId: null, loading: false },
  reducers: {
    select: ({ teacherId }, event) => ({ event, teacherId, loading: false }),
    selectTeacher: ({ event }, teacherId) => ({
      event,
      teacherId,
      loading: false,
    }),
    loading: state => ({ ...state, loading: true }),
  },
  effects: dispatch => ({
    selectAsync: async (date: Date) => {
      dispatch.event.loading()

      const dateString = moment(date).format('YYYY-M-D')
      const events = await fetch(
        `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
        options
      ).then(res => res.json())

      const entrustEvent = events.find(e => e.event_id === EVENT_ID)

      const json = await fetch(
        `${baseUrl}/api/events/list_event?instance_id=${entrustEvent.id}`,
        options
      ).then(res => res.json())

      const event = {
        id: entrustEvent.id,
        name: json.name,
        date: moment(json.start_datetime).format('M/D/YYYY'),
      }

      const teacherEvent = events.find(e => e.event_id === TEACHER_EVENT_ID)

      dispatch.event.select(event)
      dispatch.event.selectTeacher(teacherEvent.id)

      dispatch.eventPeople.selectAsync(event.id)
      dispatch.teachers.setAsync(teacherEvent.id)
      setEvent({ event, teacherId: teacherEvent.id })
    },
  }),
})

const startsWith = text => name => name.startsWith(text)

export const eventPeople = createModel({
  state: { cache: [], filtered: [] },
  reducers: {
    select: (_, payload) => {
      return { cache: payload, filtered: [] }
    },
    'event/loading': () => ({ cache: [], filtered: [] }),
    'searchText/set': ({ cache }, text) => {
      const t = text.trim().toLowerCase()
      if (!t || t.length < 3) {
        return { cache, filtered: [] }
      }

      const matcher = startsWith(t)
      const filtered = cache.filter(item => {
        const name = item.name.toLowerCase()
        return name.split(' ').some(matcher) || matcher(name)
      })

      return { cache, filtered }
    },
  },
  effects: dispatch => ({
    selectAsync: async eventId => {
      const json = await fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${eventId}`,
        options
      ).then(res => res.json())

      const people = json.filter(({ first_name }) => first_name).map(mapPerson)

      dispatch.eventPeople.select(people)

      clearInterval(attendanceInterval)

      dispatch.attendance.fetchAsync(eventId)
      attendanceInterval = setInterval(
        () => dispatch.attendance.fetchAsync(eventId),
        1000 * 60 * 1 // 5 minutes
      )
    },
  }),
})

export const teacherAttendance = createModel({
  state: [],
  reducers: {
    set: (_, attendance) => attendance,
  },
})

export const attendance = createModel({
  state: [],
  reducers: {
    set: (_, attendance) => attendance,
  },
  effects: dispatch => ({
    fetchAsync: async (eventId, { event }) => {
      const attendanceProm = fetch(
        `${baseUrl}/api/events/attendance/list?instance_id=${eventId}`,
        options
      )
        .then(res => res.json())
        .catch(() => [])

      const teacherAttendanceProm = fetch(
        `${baseUrl}/api/events/attendance/list?instance_id=${event.teacherId}`,
        options
      )
        .then(res => res.json())
        .catch(() => [])

      const [attendance, teacherAttendance] = await Promise.all([
        attendanceProm,
        teacherAttendanceProm,
      ])

      dispatch.attendance.set(attendance)
      dispatch.teacherAttendance.set(teacherAttendance)
    },
    checkInAsync: async (personId, { event: { event } }) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${
          event.id
        }`,
        options
      )
    },
    checkInTeacherAsync: async (personId, { event: { teacherId } }) => {
      await fetch(
        `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${teacherId}`,
        options
      )
    },
  }),
})

export const printer = createModel({
  state: null,
  reducers: {
    select: (_, printer) => printer,
  },
})

export const searchText = createModel({
  state: null,
  reducers: {
    set: (_, text) => text,
    'event/loading': () => null,
  },
})
