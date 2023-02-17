using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RookieOnlineAssetManagement.Migrations
{
    public partial class DropPrimaryKeyAssignment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssignmentBy_User",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Assets_AssetCode",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_AssignmentTo_User",
                table: "Assignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Assignments",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_AssetCode",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_AssignedBy",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_AssignedTo",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "AssetCode",
                table: "Assignments");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedTo",
                table: "Assignments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AssignedBy",
                table: "Assignments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AssignedTo",
                table: "Assignments",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AssignedBy",
                table: "Assignments",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Assignments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AssetCode",
                table: "Assignments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Assignments",
                table: "Assignments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssetCode",
                table: "Assignments",
                column: "AssetCode");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignedBy",
                table: "Assignments",
                column: "AssignedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignedTo",
                table: "Assignments",
                column: "AssignedTo");

            migrationBuilder.AddForeignKey(
                name: "FK_AssignmentBy_User",
                table: "Assignments",
                column: "AssignedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Assets_AssetCode",
                table: "Assignments",
                column: "AssetCode",
                principalTable: "Assets",
                principalColumn: "AssetCode");

            migrationBuilder.AddForeignKey(
                name: "FK_AssignmentTo_User",
                table: "Assignments",
                column: "AssignedTo",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
