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
    var isVisible = $(this).is(':checked');
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
        $("#items").append("<h3 style='display: inline-block'>Items</h3><button type='button' id='addItem' onclick='addItem();'>Add Item</button><br>");
        var i;
        for (i = 0; i < globalGroups.length; i++) {
            if (globalGroups[i].groupName === $("#groups").val()) {
                break;
            }
        }
        
        for (var j = 0; j < globalGroups[i].Items.length; j++) {
            var append = "";
            append += "<div class='item' data-group='" + globalGroups[i].groupName + "' data-item='" + globalGroups[i].Items[j].title + "'><h3>" + globalGroups[i].Items[j].title + "</h3>";
            if (globalGroups[i].Items[j].isVisible || globalGroups[i].Items[j].creator === username) {
                append += "<p>" + globalGroups[i].Items[j].body + "</p>";
            }

            if ((globalGroups[i].Items[j].isVisible || globalGroups[i].Items[j].creator === username) && globalGroups[i].Items[j].canEdit) {
                append += "<button class='edit' type='button'>Edit</button>";
                if (globalGroups[i].Items[j].creator === username) {
                    append += "<label>Visible</label><input class='visible' type='checkbox' ";
                    if (globalGroups[i].Items[j].isVisible) {
                        append += "checked";
                    }
                    append += ">";
                }
            }
            append += "</div><br>";
            $("#items").append(append);
        }
    }
}