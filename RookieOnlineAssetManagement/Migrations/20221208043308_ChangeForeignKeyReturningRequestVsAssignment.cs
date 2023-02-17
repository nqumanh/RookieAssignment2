using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RookieOnlineAssetManagement.Migrations
{
    public partial class ChangeForeignKeyReturningRequestVsAssignment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturningRequests_Assets_AssetCode",
                table: "ReturningRequests");

            migrationBuilder.DropIndex(
                name: "IX_ReturningRequests_AssetCode",
                table: "ReturningRequests");

            migrationBuilder.DropColumn(
                name: "AssetCode",
                table: "ReturningRequests");

            migrationBuilder.AddColumn<int>(
                name: "AssignmentId",
                table: "ReturningRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "ReturningRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_ReturningRequests_AssignmentId",
                table: "ReturningRequests",
                column: "AssignmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturningRequests_Assignments_AssignmentId",
                table: "ReturningRequests",
                column: "AssignmentId",
                principalTable: "Assignments",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturningRequests_Assignments_AssignmentId",
                table: "ReturningRequests");

            migrationBuilder.DropIndex(
                name: "IX_ReturningRequests_AssignmentId",
                table: "ReturningRequests");

            migrationBuilder.DropColumn(
                name: "AssignmentId",
                table: "ReturningRequests");

            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "ReturningRequests");

            migrationBuilder.AddColumn<string>(
                name: "AssetCode",
                table: "ReturningRequests",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReturningRequests_AssetCode",
                table: "ReturningRequests",
                column: "AssetCode");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturningRequests_Assets_AssetCode",
                table: "ReturningRequests",
                column: "AssetCode",
                principalTable: "Assets",
                principalColumn: "AssetCode");
        }
    }
}
