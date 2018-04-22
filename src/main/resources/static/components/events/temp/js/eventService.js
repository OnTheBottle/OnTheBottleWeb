function saveEvent() {
    var title = document.getElementById("title").value;
    var text = document.getElementById("text").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var place = $("#places").val();
    var owner = $("#user").val();

    $.ajax({
        type: "POST",
        url: "/saveEvent",
        data: {title: title, text: text, startTime: startTime, endTime: endTime, place: place, owner: owner},
        success: function (data) {
            document.getElementById("result").innerHTML = data;
        }
    });
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function deleteEvent() {
    var id = $("#active-events").val();

    if (id == 0) return false;

    $.ajax({
        type: "POST",
        url: "/closeEvent",
        dataType: "json",
        data: {id: id},
        success: function (data) {
            document.getElementById("result").innerHTML = data.result;
        }
    });
}

$("#active-events").change(function () {
    if($(this).val() == 0) {
        clearInfo();
        return false;
    }

    $("#passed-events").val(0);
    loadInfoEvent($(this).val());
});

$("#passed-events").change(function () {
    if($(this).val() == 0) {
        clearInfo();
        return false;
    }

    $("#active-events").val(0);
    loadInfoEvent($(this).val());
});

function loadInfoEvent(id) {
    $.ajax({
        type: "POST",
        url: "/showInfoEvent",
        dataType: "json",
        data: {id: id},
        success: function (data) {
            addText(data);
        }
    });
}

function clearInfo() {
    document.getElementById('title').value = '';
    document.getElementById('text').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('owner').innerText = '';
    $("#places").val(0);
    $("#users-event").find('option').remove();

}

function addText(data) {
    document.getElementById('title').value = data.title;
    document.getElementById('text').value = data.text;
    document.getElementById('startTime').value = data.startTime;
    document.getElementById('endTime').value = data.endTime;
    document.getElementById('owner').innerText = data.owner;
    $("#places").val(data.place);

    var usersList = data.users;
    var selectUser = document.getElementById('users-event')
    for (var key in usersList) {
        addOption(selectUser, usersList[key], usersList[key]);
    }
}

function createPlace() {
    $.ajax({
        type: "POST",
        url: "/createPlace",
        dataType: "json",
        data: {},
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });
}

$("#user").change(function () {
    $("#user-events").find('option').remove();
    if($(this).val() == 0) {
        return false;
    }

    var id = $(this).val();

    $.ajax({
        type: "POST",
        url: "/showEventsFromUser",
        dataType: "json",
        data: {id: id},
        success: function (data) {
            var events = data.activeEvents;
            var selectUserEvents = document.getElementById('user-events');

            for (var key in events)
            addOption(selectUserEvents, key, events[key]);
        }
    });
});

$("#places").change(function () {
    $("#place-events").find('option').remove();
    if($(this).val() == 0) {
        return false;
    }

    var id = $(this).val();

    $.ajax({
        type: "POST",
        url: "/showEventsFromPlace",
        dataType: "json",
        data: {id: id},
        success: function (data) {
            var events = data.activeEvents;
            var selectPlaceEvents = document.getElementById('place-events');

            for (var key in events)
                addOption(selectPlaceEvents, key, events[key]);
        }
    });
});