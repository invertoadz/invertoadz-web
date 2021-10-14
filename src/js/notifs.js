function displayNotif(type, message, autoclose = true) {
    $('#notif').removeClass('prob').removeClass('success').addClass(type)
    $('#notif span').html(message)
    $('#notif').show().removeClass('close')

    if (autoclose) {
        setTimeout(() => {
            $('#notif').addClass('close')
        }, 5000)
    }
}

export {displayNotif}