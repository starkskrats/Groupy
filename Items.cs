using System;
using System.Collections.Generic;
using System.Linq;
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

        public Items(string creator, string title)
        {
            this.creator = creator;
            this.title = title;
            isVisible = false;
            canEdit = true;
        }

        public string Creator
        {
            get { return creator; }
            set { creator = value; }
        }

        public string Title
        {
            get { return title; }
            set { title = value; }
        }

        public string TextBody
        {
            get { return textBody; }
            set { textBody = value; }
        }

        public bool IsVisible
        {
            get { return isVisible; }
            set { isVisible = value; }
        }

        public bool CanEdit
        {
            get { return canEdit; }
            set { canEdit = value; }
        }
    }
}
