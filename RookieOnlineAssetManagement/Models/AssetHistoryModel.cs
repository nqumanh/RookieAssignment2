using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetHistoryModel
    {
        public List<AssignmentHistoryDTO> AssignmentHistory { get; set; }
        public List<ReturningRequestHistoryModel> ReturningRequestHistory { get; set; }
    }
}
