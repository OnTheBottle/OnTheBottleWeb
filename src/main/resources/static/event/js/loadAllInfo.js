$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/showAllEvents",
        dataType: "json",
        data: {},
        success: function (data) {
            var activeEvents = data.activeEvents;
            var selectActiveEvents = document.getElementById('active-events');
            loadEvents(activeEvents, selectActiveEvents);

            var passedEvents = data.passedEvents;
            var selectPassedEvents = document.getElementById('passed-events');
            loadEvents(passedEvents, selectPassedEvents);
        }
    });
});

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/showAllPlaces",
        dataType: "json",
        data: {},
        success: function (data) {
            var list = data.list;
            var selectPlaces = document.getElementById('places');
            loadPlaces(list, selectPlaces);
        }
    });
});

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/showAllUsers",
        dataType: "json",
        data: {},
        success: function (data) {
            var list = data.list;
            var selectUsers = document.getElementById('users');
            loadUsers(list, selectUsers);
            selectUsers = document.getElementById('user');
            loadUsers(list, selectUsers);
        }
    });
});

function loadUsers(users, select) {
    var choiceEvent = "Выберите пользователя";
    addOption(select, 0, choiceEvent);
    for (var key in users) {
        addOption(select, users[key], users[key]);
    }
}

function loadPlaces(places, select) {
    var choiceEvent = "Выберите место";
    addOption(select, 0, choiceEvent);
    for (var key in places) {
        addOption(select, places[key], places[key]);
    }
}

function loadEvents(events, select) {
    var choiceEvent;

    if (Object.keys(events).length !== 0) {
        choiceEvent = "Выберите эвент";
        addOption(select, 0, choiceEvent);
        for (var key in events) {
            addOption(select, key, events[key]);
        }
    } else {
        choiceEvent = "Нет ниодного эвента";
        addOption(select, 0, choiceEvent);
    }
}

function addOption(oListbox, key, value) {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(value));
    oOption.setAttribute("value", key);
    oListbox.appendChild(oOption);
}
