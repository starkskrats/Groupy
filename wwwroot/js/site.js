"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/home").build();
connection.start();
var globalGroups = [];
var username = "";
connection.on("ReceiveData", (groups) => {
    console.log(groups);
    globalGroups = groups;
    showItems();
});

connection.on("PopulateGroups", (groups) => {
    $("#groups").find('option').not(':first').remove();
    for (var i = 0; i < groups.length; i++) {
        $("#groups").append("<option value='" + groups[i].groupName + "'>" + groups[i].groupName + "</option>")
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

function updateItem(groupName, itemName, body) {
    connection.invoke("UpdateItem", groupName, itemName, body).catch(err => console.error(err.toString()));
}

function switchVisibility(groupName, itemName, visibility) {
    connection.invoke("SwitchVisibility", groupName, itemName, visibility).catch(err => console.error(err.toString()));
}

function switchEditable(groupName, itemName, editable) {
    connection.invoke("SwitchEditable", groupName, itemName, editable).catch(err => console.error(err.toString()));
}

$(document).on('click', '.visible', function(e) {
    e.preventDefault();
    var groupName = $(this).parent().attr('data-group');
    var itemName = $(this).parent().attr('data-item');
    var isVisible;
    if ($(this).attr('data-visible') === "true") {
        isVisible = false;
    } else {
        isVisible = true;
    }
    switchVisibility(groupName, itemName, isVisible);
});

$(document).on('click', '.edit', function(e) {
    e.preventDefault();
    var groupName = $(this).parent().attr('data-group');
    var itemName = $(this).parent().attr('data-item');
    switchEditable(groupName, itemName, false);
    var i;
    for (i = 0; i < globalGroups.length; i++) {
        if (globalGroups[i].groupName === groupName) {
            break;
        }
    }

    var j;
    for (j = 0; j < globalGroups[i].Items.length; j++) {
        if (globalGroups[i].Items[j].title === itemName) {
            break;
        }
    }
    
    var body = globalGroups[i].Items[j].body;
    body = prompt("Please enter the item's body text", body);
    if (body !== null && body !== "") {
        updateItem(groupName, itemName, body);
    }
    switchEditable(groupName, itemName, true);
});

function showItems() {
    $("#items").empty();
    if ($("#groups").val() !== "") {
        $("#items").append("<button type='button' id='addItem' class='btn btn-primary' onclick='addItem();'>Add Item</button><br><br>");
        var i;
        for (i = 0; i < globalGroups.length; i++) {
            if (globalGroups[i].groupName === $("#groups").val()) {
                break;
            }
        }
        var append = "";
        append += "<div class='row'>";
        for (var j = 0; j < globalGroups[i].Items.length; j++) {
            append += "<div class='card' style='width: 18rem; margin: 20px;'>";
            append += "<div class='item card-body' data-group='" + globalGroups[i].groupName + "' data-item='" + globalGroups[i].Items[j].title + "'><h5 class='card-title'>" + globalGroups[i].Items[j].title + "</h5>";
            if (globalGroups[i].Items[j].isVisible) {
                append += "<p class='card-text'>" + globalGroups[i].Items[j].body + "</p>";
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