using RookieOnlineAssetManagement.Models.Assignment;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Models
{
    public class ReportPagingModel
    {
        public List<ReportDTO> Reports { get; set; }
        public int TotalItem { get; set; }
        public int Page { get; set; }
        public int LastPage { get; set; }
    }
}
