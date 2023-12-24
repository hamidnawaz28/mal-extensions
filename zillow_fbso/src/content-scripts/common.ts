export const postButton = () => {
    const newPublishButton = document.createElement('button')
    newPublishButton.style.color = 'white'
    newPublishButton.style.width = '100%'
    newPublishButton.style.padding = '3px'
    newPublishButton.style.cursor = "pointer"
    newPublishButton.style.backgroundColor = '#e78e18'
    newPublishButton.style.border = 'none'
    newPublishButton.style.borderRadius = '4px'
    newPublishButton.style.zIndex = "1000"
    newPublishButton.innerText = 'Post to Facebook'
    newPublishButton.setAttribute('id', 'post-to-facebook')
    return newPublishButton
}

export const alreadyPostButton = () => {
    const newPublishButton = document.createElement('button')
    newPublishButton.style.color = 'white'
    newPublishButton.style.width = '100%'
    newPublishButton.style.padding = '3px'
    newPublishButton.style.backgroundColor = 'rgb(108 137 226)'
    newPublishButton.style.border = 'none'
    newPublishButton.style.borderRadius = '4px'
    newPublishButton.style.zIndex = "1000"
    newPublishButton.innerText = 'Already Posted'
    newPublishButton.setAttribute('id', 'already-post-to-facebook')
    return newPublishButton
}