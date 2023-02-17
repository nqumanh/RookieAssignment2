using System;

namespace RookieOnlineAssetManagement.Models
{
    public class AssignmentFilters
    {
        public string State { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string SearchWords { get; set; }
        public string SortBy { get; set; }
        public string SortType { get; set; }
    }
}
