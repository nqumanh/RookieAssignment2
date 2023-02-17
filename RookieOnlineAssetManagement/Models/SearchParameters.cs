namespace RookieOnlineAssetManagement.Models;

public class SearchParameters
{
    const int maxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 10;
    public int PageSize
    {
        get
        {
            return _pageSize;
        }
        set
        {
            _pageSize = (value > maxPageSize) ? maxPageSize : value;
        }
    }
    public string SearchString { get; set; }
    public string SortBy { get; set; }
    public bool SortType { get; set; }
}