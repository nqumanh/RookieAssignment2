using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;

namespace RookieOnlineAssetManagement;
public class Program
{
    public static void Main(string[] args)
    {
        var builder = CreateHostBuilder(args).Build();

        using (var scope = builder.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            using (var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>())
            {
                applicationDbContext.Database.Migrate();
                using (var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>())
                {
                    StartData.Initialize(userManager).Wait();
                }
            }
        }

        builder.Run();

    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

