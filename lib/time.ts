const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
const week = day * 7
const month = day * 30.415
const year = month * 12

type Time = {
  [key: string]: number
}

export const time: Time = {
  second,
  minute,
  hour,
  day,
  week,
  month,
  year,
}
