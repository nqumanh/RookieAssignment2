using RookieOnlineAssetManagement.Enum;
using System;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Entities
{
    public class Assignment
    {
        public int Id { get; set; }
        public string AssignedBy { get; set; }
        public string AssignedTo { get; set; }
        public DateTime AssignedDate { get; set; }
        public string Note { get; set; }
        public AssignmentState State { get; set; }
        public bool IsDisabled { get; set; }

        public virtual User AssignedByUser { get; set; }
        public virtual User AssignedToUser { get; set; }
        public virtual Asset Asset { get; set; }

        public virtual ICollection<ReturningRequest> ReturningRequests { get; set; } = new List<ReturningRequest>();
    }
}

