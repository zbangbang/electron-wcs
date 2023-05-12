import db from '@/utils/localstorage'

/* 任务操作相关start */
const ConferenceId = 'CONFERENCE_ID'

export function setTaskIdStorage(val) {
  return db.save(ConferenceId, val)
}
export function getTaskIdStorage() {
  return db.get(ConferenceId)
}
export function removeTaskIdStorage() {
  return db.remove(ConferenceId)
}
/* 任务操作相关end */
