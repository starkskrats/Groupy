using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Groupy
{
    public class Group
    {
        public static List<Group> groups = new List<Group>();
        
        private string name;
        private int id;
        private int itemID = 0;
        private static int groupID = 0;
        
        private List<Items> groupItems;

        public Group(string name)
        {
            this.id = ++groupID;
            this.name = name;
            groupItems = new List<Items>();
        }
        
        [JsonPropertyName("ID")]
        public int ID
        {
            get { return id; }
            set { id = value; }
        }
        
        [JsonPropertyName("groupName")]
        public string Name
        {
            get { return name; }
            set { name = value; }
        }
        
        [JsonPropertyName("Items")]
        public List<Items> GetItems
        {
            get { return groupItems; }
            set { groupItems = value; } // likely won't need a set for this one.
        }

        /// <summary>
        /// Add a new item to the group.
        /// </summary>
        /// <param name="item"></param>
        public void addItem(string username, string itemName, string itemBody)
        {
            groupItems.Add(new Items(++itemID, username, itemName, itemBody));
        }

        public static void addGroup(string groupName)
        {
           Group.groups.Add(new Group(groupName));
        }
    }
}
