namespace RookieOnlineAssetManagement.Models
{
    public class PaginationParameters
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public PaginationParameters()
        {
            PageNumber = 1;
            PageSize = 10;
        }

        public PaginationParameters(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber < 1 ? 1 : pageNumber;
            PageSize = pageSize < 1 ? 1 : pageSize;
        }
    }
}
