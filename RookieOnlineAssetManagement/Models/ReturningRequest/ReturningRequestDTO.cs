using System;
using RookieOnlineAssetManagement.Enum;

namespace RookieOnlineAssetManagement.Models
{
    public class ReturningRequestDTO
    {
        public int Id { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string RequestedBy { get; set; }
        public string AcceptedBy { get; set; }
        public DateTime ReturnedDate { get; set; }
        public ReturningRequestState State { get; set; }
    }
}