using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Groupy
{
    public class Items
    {

        private string creator;
        private string title;
        private string textBody;
        private bool isVisible;
        private bool canEdit;

        public Items(string creator, string title, string textBody)
        {
            this.creator = creator;
            this.title = title;
            this.textBody = textBody;
            isVisible = false;
            canEdit = true;
        }
        
        [JsonPropertyName("creator")]
        public string Creator
        {
            get { return creator; }
            set { creator = value; }
        }

        [JsonPropertyName("title")]
        public string Title
        {
            get { return title; }
            set { title = value; }
        }
        
        [JsonPropertyName("body")]
        public string TextBody
        {
            get { return textBody; }
            set { textBody = value; }
        }

        [JsonPropertyName("isVisible")]
        public bool IsVisible
        {
            get { return isVisible; }
            set { isVisible = value; }
        }
        
        [JsonPropertyName("canEdit")]
        public bool CanEdit
        {
            get { return canEdit; }
            set { canEdit = value; }
        }
        
        public void UpdateItem(string bodyText)
        {
            TextBody = bodyText;
        }
        
        public void SwitchVisibility(bool visibility)
        {
            IsVisible = visibility;
        }
        
        public void SwitchEditable(bool editable)
        {
            CanEdit = editable;
        }
    }
}
