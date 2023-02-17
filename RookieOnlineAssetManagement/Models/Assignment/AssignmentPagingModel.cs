using System.Collections.Generic;
using System.Linq;

namespace RookieOnlineAssetManagement.Models.Assignment
{
    public class AssignmentPagingModel
    {
        public List<AssignmentViewDTO> Assignments { get; set; }
        public int TotalItem{ get; set; }
        public int Page{ get; set; }
        public int LastPage { get; set; }
    }
}
