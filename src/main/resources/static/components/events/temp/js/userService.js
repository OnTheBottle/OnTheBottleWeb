function createUser() {
    $.ajax({
        type: "POST",
        url: "/createUser",
        dataType: "json",
        data: {},
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });
}

function addUserToEvent() {
    var idEvent = $("#active-events").val();
    var idUser = $("#users").val();

    $.ajax({
        type: "POST",
        url: "/addUserToEvent",
        dataType: "json",
        data: {idEvent: idEvent, idUser: idUser},
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });
}

function deleteUserFromEvent() {
    var idEvent = $("#active-events").val();
    var idUser = $("#users-event").val();

    $.ajax({
        type: "POST",
        url: "/deleteUserFromEvent",
        dataType: "json",
        data: {idEvent: idEvent, idUser: idUser},
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });
}