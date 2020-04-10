using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Groupy
{
    public class Group
    {

        private string name;
        private List<Items> groupItems;

        public Group(string name)
        {
            this.name = name;
            groupItems = new List<Items>();
        }

        public string Name
        {
            get { return name; }
            set { name = value; }
        }

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

        /// <summary>
        /// Remove an item from the group list.
        /// </summary>
        /// <param name="item"></param>
        public void removeItem(Items item)
        {
            if(groupItems.Contains(item))
                groupItems.Remove(item);
        }

        public void updateItem(Items item)
        {
            /* The code here will depend upon how we plan to implement updating an item. If we create the item in main and then just want to pass it in here, then we'd need to add a second
             * string value (one to track the item, one to track the editted changes). WE'd also need to make a method to call on the item's canEdit to set it 
             * false so that multiple people can't edit it at once.
             * 
             * Alternatively, when they click the update button, it calls this method and passes in the item to update. This method then sets the isEdit to false which means one less inner method.
             * However, depending on how the Async works, it may not be as easy. In this case, we'd create an internal string attribute to hold the text changes.
             * 
             * Either way, once the changes are 'saved', the code would find the item within the groupItems and do a set on the textBody.
             */ 
        }
    }
}
