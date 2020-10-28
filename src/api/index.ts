import Constants from 'expo-constants'
import moment from 'moment'
import { DATE_FORMAT, SUB } from '../env'
import { BreezeEvent, EventPerson, Person } from '../models/dataModel'

export const baseUrl = `https://${SUB}.breezechms.com`
const options = { headers: { 'Api-key': Constants.manifest.extra.API_KEY } }

type Cache = {
  [key: string]: any
}

const cache: Cache = {}
const fetchWithCache = async (input: string, init?: RequestInit) => {
  if (!cache[input]) {
    cache[input] = await fetch(input, init).then((res) => res.json())
  }

  return cache[input]
}

export const getEventsForDate = async (date: string) => {
  const dateString = moment(date, DATE_FORMAT).format('YYYY-M-D')
  const events = (await fetchWithCache(
    `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
    options,
  )) as BreezeEvent[]

  return events
}

export const getEvent = async (eventId: string) => {
  const event = (await fetch(
    `${baseUrl}/api/events/list_event?instance_id=${eventId}`,
    options,
  ).then((res) => res.json())) as BreezeEvent

  return event
}

export const getEligibleForEvent = async (eventId: string) => {
  const eligible = (await fetch(
    `${baseUrl}/api/events/attendance/eligible?instance_id=${eventId}`,
    options,
  ).then((res) => res.json())) as EventPerson[]

  return eligible
}

export const getPerson = async (personId: string) => {
  const person = (await fetch(`${baseUrl}/api/people/${personId}`, options).then((res) =>
    res.json(),
  )) as Person

  return person
}

export const checkInPerson = async (eventId: string, personId: string) => {
  await fetch(
    `${baseUrl}/api/events/attendance/add?person_id=${personId}&instance_id=${eventId}`,
    options,
  )
}

export const getAttendance = async (eventId: string) => {
  const attendance = await fetch(
    `${baseUrl}/api/events/attendance/list?instance_id=${eventId}`,
    options,
  ).then((res) => res.json())

  return attendance
}
