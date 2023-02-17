using System;

namespace RookieOnlineAssetManagement.Models
{
    public class AssignmentHistoryDTO
    {
        public DateTime AssignedDate { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
    }
}
