import moment from 'moment'
import { DATE_FORMAT } from '../../env'

export const getStyle = () => `
<style>
  html,
  body {
    margin: 0;
  }

  div.page {
    height: 100%;
    font-family: sans-serif;
    font-size: 15px;
  }

  div.parent-label {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  div.child-label {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
  }

  div.top {
    display: flex;
    justify-content: space-between;
  }

  div.middle {
    text-align: center;
  }

  div.name {
    font-weight: bold;
    font-size: 25px;
  }

  div.date {
    margin-top: 5px;
  }

  div.adult-label {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 25px;
  }
</style>
`

export const getParentLabelHtml = (childNames: string[], parentNames: string) => {
  const dateTime = moment().format(`${DATE_FORMAT} h:mm A`)
  const childrenHtml = childNames.map((name) => `<div>${name}</div>`).join('')

  return `
  <div class="page">
  <div class="parent-label">
    <div>${parentNames}</div>
    ${childrenHtml}
    <div class="date">${dateTime}</div>
  </div>
</div>
`
}

export const getChildLabelHtml = (
  name: string,
  parentNames: string,
  medical: string,
  entrustId: string,
) =>
  `
<div class="page">
  <div class="child-label">
    <div class="top">
      <div>${moment().format(DATE_FORMAT)}</div>
      <div>${entrustId || ''}</div>
    </div>
    <div class="middle">
      <div class="name">${name}</div>
      <div class="parents">${parentNames}</div>
    </div>
    <div class="bottom">${medical || ''}</div>
  </div>
</div>
`

export const getAdultLabelHtml = (name: string) =>
  `
<div class="page">
  <div class="adult-label">${name}</div>
</div>
`
