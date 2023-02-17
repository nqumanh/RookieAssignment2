using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RookieOnlineAssetManagement.Migrations
{
    public partial class AddReturningRequestEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReturningRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReturnedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    State = table.Column<int>(type: "int", nullable: false),
                    RequestedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AcceptedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AssetCode = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReturningRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReturningRequests_AspNetUsers_AcceptedById",
                        column: x => x.AcceptedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ReturningRequests_AspNetUsers_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ReturningRequests_Assets_AssetCode",
                        column: x => x.AssetCode,
                        principalTable: "Assets",
                        principalColumn: "AssetCode");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReturningRequests_AcceptedById",
                table: "ReturningRequests",
                column: "AcceptedById");

            migrationBuilder.CreateIndex(
                name: "IX_ReturningRequests_AssetCode",
                table: "ReturningRequests",
                column: "AssetCode");

            migrationBuilder.CreateIndex(
                name: "IX_ReturningRequests_RequestedById",
                table: "ReturningRequests",
                column: "RequestedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReturningRequests");
        }
    }
}
