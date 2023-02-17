using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models.Assignment
{
    public class AssignmentDetailDTO
    {
        public int Id { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedBy { get; set; }
        public string FullnameUser { get; set; }
        public DateTime AssignedDate { get; set; }
        public AssignmentState State { get; set; }
        public string Note { get; set; }
    }
}
