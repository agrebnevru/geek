var intervalId = 0
var intervalDelay = 1000
var currentDate = null
var timeAcceleration = 60

function getCurrentDatetime(timestamp) {
    if (null === currentDate) {
        currentDate = new Date(timestamp * 1000)
    }
    return currentDate
}

function getPostData(currentDatetime) {
    
    let timestamp = Math.floor(currentDatetime.getTime() / 1000)

    let postData = {
        datetimeEntity: currentDatetime,
        timestamp: timestamp,
        dateFullDisplay: '',
        dayDisplay: currentDatetime.getDate(),
        monthDisplay: Number(currentDatetime.getMonth()) + 1,
        yearDisplay: currentDatetime.getFullYear(),
        hourDisplay: currentDatetime.toLocaleTimeString({}, { hour: '2-digit' }),
        minuteDisplay: currentDatetime.toLocaleTimeString({}, { minute: '2-digit' }),
        timeDisplay: currentDatetime.toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit' }),
    }

    if (10 > postData.dayDisplay) {
        postData.dayDisplay = '0' + postData.dayDisplay
    }
    if (10 > postData.monthDisplay) {
        postData.monthDisplay = '0' + postData.monthDisplay
    }
    if (10 > postData.hourDisplay) {
        postData.hourDisplay = '0' + postData.hourDisplay
    }
    if (10 > postData.minuteDisplay) {
        postData.minuteDisplay = '0' + postData.minuteDisplay
    }

    postData.dateFullDisplay = `${postData.dayDisplay}.${postData.monthDisplay}.${postData.yearDisplay}`

    return postData
}

self.addEventListener('message', async (e) => {

    let currentDatetime = getCurrentDatetime(e.data.timestamp)

    let postData = getPostData(currentDatetime)

    self.postMessage(postData)

    intervalId = setInterval(() => {
        currentDatetime.setSeconds(currentDatetime.getSeconds() + timeAcceleration)

        postData = getPostData(currentDatetime)
    
        self.postMessage(postData)
    }, intervalDelay)

})
