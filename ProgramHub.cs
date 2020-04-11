using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Groupy
{
    public class ProgramHub : Hub
    {
        public async Task Login(string username)
        {
            Context.Items["username"] = username;
            await Clients.Caller.SendAsync("PopulateGroups", Group.groups);
            await Clients.Caller.SendAsync("ReceiveData", Group.groups);
        }

        public async Task SendGroups()
        {
            await Clients.All.SendAsync("ReceiveData", Group.groups);
        }
        
        public async Task AddGroup(string groupName)
        {
            Group.addGroup(new Group(groupName));
            await Clients.All.SendAsync("PopulateGroups", Group.groups);
            await SendGroups();
        }
        
        public async Task AddItem(string groupName, string itemName, string itemBody)
        {
            Group.groups.Find(group => group.Name == groupName).addItem(new Items(Context.Items["username"].ToString(), itemName, itemBody));
            await SendGroups();
        }
        
        public async Task UpdateItem(string groupName, string itemName, string itemBody)
        {
            Group.groups.Find(group => group.Name == groupName).GetItems.Find(item => item.Title == itemName).UpdateItem(itemBody);
            await SendGroups();
        }
        
        public async Task SwitchVisibility(string groupName, string itemName, bool visibility)
        {
            Group.groups.Find(group => group.Name == groupName).GetItems.Find(item => item.Title == itemName).SwitchVisibility(visibility);
            await SendGroups();
        }
        
        public async Task SwitchEditable(string groupName, string itemName, bool editable)
        {
            Group.groups.Find(group => group.Name == groupName).GetItems.Find(item => item.Title == itemName).SwitchEditable(editable);
            await SendGroups();
        }
    }
}