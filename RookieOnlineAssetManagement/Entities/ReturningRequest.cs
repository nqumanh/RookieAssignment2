using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Entities
{
    public class ReturningRequest
    {
        public int Id { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public ReturningRequestState State { get; set; }
        public bool IsDisabled { get; set; }
        public User RequestedBy { get; set; }
        public User AcceptedBy { get; set; }
        
        public virtual Assignment Assignment { get; set; }
    }
}
