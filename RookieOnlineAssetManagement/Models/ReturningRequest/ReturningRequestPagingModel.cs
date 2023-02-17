using System.Collections.Generic;
using System.Linq;

namespace RookieOnlineAssetManagement.Models;

public class ReturningRequestPagingModel
{
    public List<ReturningRequestDTO> ReturningRequests { get; set; }
    public int TotalItem { get; set; }
}
