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
            Group.addGroup(groupName);
            await Clients.All.SendAsync("PopulateGroups", Group.groups);
            await SendGroups();
        }
        
        public async Task AddItem(string groupID, string itemName, string itemBody)
        {
            Group.groups.Find(group => group.ID == Int32.Parse(groupID)).addItem(Context.Items["username"].ToString(), itemName, itemBody);
            await SendGroups();
        }
        
        public async Task UpdateItem(string groupID, string itemID, string itemBody)
        {
            Group.groups.Find(group => group.ID == Int32.Parse(groupID)).GetItems.Find(item => item.ID == Int32.Parse(itemID)).UpdateItem(itemBody);
            await SendGroups();
        }
        
        public async Task SwitchVisibility(string groupID, string itemID, bool visibility)
        {
            Group.groups.Find(group => group.ID == Int32.Parse(groupID)).GetItems.Find(item => item.ID == Int32.Parse(itemID)).SwitchVisibility(visibility);
            await SendGroups();
        }
        
        public async Task SwitchEditable(string groupID, string itemID, bool editable)
        {
            Group.groups.Find(group => group.ID == Int32.Parse(groupID)).GetItems.Find(item => item.ID == Int32.Parse(itemID)).SwitchEditable(editable);
            await SendGroups();
        }
    }
}