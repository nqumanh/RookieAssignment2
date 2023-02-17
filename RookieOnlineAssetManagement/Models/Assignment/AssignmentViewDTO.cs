using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models.Assignment
{
    public class AssignmentViewDTO
    {
        public int AssignmentId { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Category { get; set; }
        public DateTime AssignedDate { get; set; }
        public AssignmentState State { get; set; }
        public bool IsWaitingForReturningRequest { get; set; }
    }
}