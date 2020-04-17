"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/home").build();
connection.start();
var globalGroups = [];
var username = "";
connection.on("ReceiveData", (groups) => {
    globalGroups = groups;
    showItems();
});

connection.on("PopulateGroups", (groups) => {
    $("#groups").find('option').not(':first').remove();
    for (var i = 0; i < groups.length; i++) {
        $("#groups").append("<option value='" + groups[i].ID + "'>" + escapeHTML(groups[i].groupName) + "</option>")
    }
});

$("#loginButton").click(function(){
    if ($("#username").val() === "") {
        alert('Please provide a username');
        return false;
    } else {
        connection.invoke("Login", $("#username").val()).catch(err => console.error(err.toString()));
        username = $("#username").val();
        $("#login").hide();
        $("#main").show();
    }
});

$("#addGroup").click(function(){
    var groupName = "";
    while (groupName === "") {
        groupName = prompt("Please enter a group name");
    }
    
    if (groupName !== null) {
        connection.invoke("AddGroup", groupName).catch(err => console.error(err.toString()));
    }
});

function addItem() {
    var itemName = "";
    var itemBody = "";
    while (itemName === "") {
        itemName = prompt("Please enter the item's name");
    }
    while (itemBody === "") {
        itemBody = prompt("Please enter the item's body text");
    }

    if (itemName !== null && itemBody !== null) {
        connection.invoke("AddItem", $("#groups").val(), itemName, itemBody).catch(err => console.error(err.toString()));
    }
}

$("#groups").change(function(){
    $("#default").prop('disabled', true);
    showItems();
});

function updateItem(groupID, itemID, body) {
    connection.invoke("UpdateItem", groupID, itemID, body).catch(err => console.error(err.toString()));
}

function switchVisibility(groupID, itemID, visibility) {
    connection.invoke("SwitchVisibility", groupID, itemID, visibility).catch(err => console.error(err.toString()));
}

function switchEditable(groupID, itemID, editable) {
    connection.invoke("SwitchEditable", groupID, itemID, editable).catch(err => console.error(err.toString()));
}

$(document).on('click', '.visible', function(e) {
    e.preventDefault();
    var groupID = $(this).parent().attr('data-group');
    var itemID = $(this).parent().attr('data-item');
    var isVisible;
    if ($(this).attr('data-visible') === "true") {
        isVisible = false;
    } else {
        isVisible = true;
    }
    switchVisibility(groupID, itemID, isVisible);
});

$(document).on('click', '.edit', function(e) {
    e.preventDefault();
    var groupID = $(this).parent().attr('data-group');
    var itemID = $(this).parent().attr('data-item');
    switchEditable(groupID, itemID, false);
    var body = prompt("Please enter the item's body text", $(this).prev().text());
    if (body !== null && body !== "") {
        updateItem(groupID, itemID, body);
    }
    switchEditable(groupID, itemID, true);
});

function showItems() {
    $("#items").empty();
    if ($("#groups").val() !== "") {
        $("#items").append("<button type='button' id='addItem' class='btn btn-primary' onclick='addItem();'>Add Item</button><br><br>");
        var i;
        for (i = 0; i < globalGroups.length; i++) {
            if (globalGroups[i].ID == $("#groups").val()) {
                break;
            }
        }
        var append = "";
        append += "<div class='row'>";
        for (var j = 0; j < globalGroups[i].Items.length; j++) {
            append += "<div class='card' style='width: 18rem; margin: 20px;'>";
            append += "<div class='item card-body' data-group='" + globalGroups[i].ID + "' data-item='" + globalGroups[i].Items[j].ID + "'><h5 class='card-title'>" + escapeHTML(globalGroups[i].Items[j].title) + "</h5>";
            if (globalGroups[i].Items[j].isVisible) {
                append += "<p class='card-text'>" + escapeHTML(globalGroups[i].Items[j].body) + "</p>";
                if (globalGroups[i].Items[j].canEdit) {
                    append += "<a href='#' class='edit card-link'>Edit</a>";
                }
            }

            if (globalGroups[i].Items[j].creator === username && globalGroups[i].Items[j].canEdit) {
                append += "<a href='#' class='visible card-link' data-visible='";
                if (globalGroups[i].Items[j].isVisible) {
                    append += "true'>Hide";
                } else {
                    append += "false'>Show";
                }
                append += "</a>";
            }
            append += "</div></div>";
        }
        append += "</div>";
        $("#items").append(append);
    }
}

function escapeHTML(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}