using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Helpper
{
    public static class Utilities
    {
        public static string ChangeFormatName(string url)
        {
            url = url.ToLower();
            url = Regex.Replace(url, @"[áàạảãâấầậẩẫăắằặẳẵ]", "a");
            url = Regex.Replace(url, @"[éèẹẻẽêếềệểễ]", "e");
            url = Regex.Replace(url, @"[óòọỏõôốồộổỗơớờợởỡ]", "o");
            url = Regex.Replace(url, @"[íìịỉĩ]", "i");
            url = Regex.Replace(url, @"[ýỳỵỉỹ]", "y");
            url = Regex.Replace(url, @"[úùụủũưứừựửữ]", "u");
            url = Regex.Replace(url, @"[đ]", "d");

            url = Regex.Replace(url.Trim(), @"[^0-9a-z-\s]", "").Trim();
            while (true)
            {
                if (url.IndexOf("--") != -1)
                {
                    url = url.Replace("--", "-");
                }
                else
                {
                    break;
                }
            }
            return url;
        }
        public static string OptimizeSpace(string url)
        {
            StringBuilder builder = new();
            int l = url.Length;
            for (int i = 1; i < l; i++)
            {
                if (url[i - 1] != ' ' || (url[i] != ' ' && url[i - 1] == ' '))
                {
                    builder.Append(url[i - 1]);
                }
                if (i == l - 1 && url[i] != ' ')
                {
                    builder.Append(url[i]);
                }
            }
            return builder.ToString().Trim();
        }
    }
}
