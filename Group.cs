using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Groupy
{
    public class Group
    {
        public static List<Group> groups = new List<Group>();
        
        private string name;
        
        private List<Items> groupItems;

        public Group(string name)
        {
            this.name = name;
            groupItems = new List<Items>();
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
        public void addItem(Items item)
        {
            groupItems.Add(item);
        }

        public static void addGroup(Group group)
        {
            groups.Add(group);
        }
    }
}
