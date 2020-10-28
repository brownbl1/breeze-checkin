export type FamilyPerson = {
  id: string
  oid: string
  person_id: string
  family_id: string
  family_role_id: string
  created_on: string
  role_name: string
  role_id: string
  order: string
  details: {
    id: string
    first_name: string
    force_first_name: string
    last_name: string
    path: string
    thumb_path: string
  }
}

export type Person = {
  id: string
  first_name: string
  force_first_name: string
  last_name: string
  path: string
  nick_name: string
  middle_name: string
  maiden_name: string
  thumb_path: string
  street_address: string
  city: string
  state: string
  zip: string
  details: {
    person_id: string
    birthdate: string
    '2022452148': string // allergies
    '2022452154': string // pin
    '2022452149': string // entrust key
  }
  family: FamilyPerson[]
}

export type EventPerson = {
  id: string
  first_name: string
  force_first_name: string
  last_name: string
  path: string
}

export type Attendance = {
  instance_id: string
  person_id: string
  check_out: string
  created_on: string
}

export type BreezeEvent = {
  id: string
  oid: string
  event_id: string
  name: string
  category_id: string
  settings_id: string
  start_datetime: string
  end_datetime: string
  is_modified: string
  created_on: string
}
