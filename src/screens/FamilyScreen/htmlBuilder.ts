import moment from 'moment'
import { DATE_FORMAT } from '../../env'

type ParentLabelArgs = {
  selectedChildrenNames: string[]
  parentNames: string
}

export const getParentLabelHtml = ({
  selectedChildrenNames,
  parentNames,
}: ParentLabelArgs) => {
  const dateTime = moment().format(`${DATE_FORMAT} h:mm A`)
  const childrenHtml = selectedChildrenNames.map((name) => `<div>${name}</div>`).join('')

  const column = `
<div class="column">
  <div class="names">
    <div>${parentNames}</div>
    ${childrenHtml}
  </div>
  <div>${dateTime}</div>
</div>`

  return `
<style>
html,
body {
  margin: 0;
}

#container {
  font-family: sans-serif;
  font-size: 10px;
  text-align: center;
  display: flex;
  height: 100%;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.names {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vertical {
  border: 2px solid #aaa;
  margin: 10px 0;
}
</style>

<div id="container">
  ${column}
  <div class="vertical"></div>
  ${column}
</div>`
}

type LabelHtmlArgs = {
  entrustId: string
  name: string
  parentNames: string
  medical: string
}

export const getChildLabelHtml = ({
  entrustId,
  name,
  parentNames,
  medical,
}: LabelHtmlArgs) =>
  `
<style>
html,
body {
  margin: 0;
}

#container {
  font-family: sans-serif;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

#top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name {
  font-size: 25px;
  font-weight: bold;
}

#parents {
  font-size: 15px;
}
</style>

<div id="container">
  <div id="top">
    <div>${moment().format(DATE_FORMAT)}</div>
    <div>${entrustId || ''}</div>
  </div>
  <div id="middle">
    <div id="name">
      ${name}
    </div>
    <div id="parents">
      ${parentNames}
    </div>
  </div>
  <div>
    ${medical || ''}
  </div>
</div>`

export const getAdultLabelHtml = (name: string) =>
  `
<style>
html,
body {
  margin: 0;
}

#container {
  font-family: sans-serif;
  font-size: 25px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

<div id="container">
  <div>
    ${name}
  </div>
</div>`
