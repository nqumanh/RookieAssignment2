using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class ReturningRequestCreateModel
    {
        public int Id { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public ReturningRequestState State { get; set; }
        public string RequestById { get; set; }
        public string AcceptedById { get; set; }
        public int AssignmentId { get; set; }
        public bool IsDisabled { get; set; }
    }
}