using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models.Assignment;
using System;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.UnitTests.TestData
{
    public class AssignmentTestData
    {
        public static List<Assignment> GetAssignments()
        {
            return new List<Assignment>() {
                new Assignment() {
                    Id = 1,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.WaitingForAcceptance,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "Laptop1",AssetCode = "LA000010", Location = "HCM", IsDisabled = false, State = Enum.AssetState.Available }
                },
                new Assignment() {
                    Id = 2,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.WaitingForAcceptance,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "Monitor1",AssetCode = "MO000010",Location = "HN", IsDisabled = false,State = Enum.AssetState.NotAvailable}

                },
                new Assignment() {
                    Id = 3,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.WaitingForAcceptance,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "Personal Computer1",AssetCode = "PC000010",Location = "HCM", IsDisabled = true,State = Enum.AssetState.NotAvailable}
                },
                new Assignment() {
                    Id = 4,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.WaitingForAcceptance,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "KeyBoard",AssetCode = "KB000010",Location = "HCM", IsDisabled = true,State = Enum.AssetState.NotAvailable}
                },

            };
        }

        public static List<Assignment> GetAssignmentsForCreate()
        {
            return new List<Assignment>() {
                new Assignment() {
                    Id = 1,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.Accepted,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "Laptop1",AssetCode = "LA000010", Location = "HCM", IsDisabled = false, State = Enum.AssetState.Available }
                },
                new Assignment() {
                    Id = 2,
                    AssignedBy = "UserA",
                    AssignedTo = "UserB",
                    AssignedDate = DateTime.Now,
                    State = Enum.AssignmentState.WaitingForAcceptance,
                    IsDisabled = false,
                    Note = "test",
                    Asset = new Asset(){ AssetName = "Monitor1",AssetCode = "MO000010",Location = "HN", IsDisabled = false,State = Enum.AssetState.NotAvailable}

                },
            };
        }

        public static AssignmentDetailDTO FakeAssignment()
        {
            return new AssignmentDetailDTO
            {
                Id = 1,
                AssignedBy = "UserA",
                AssignedTo = "UserB",
                AssignedDate = DateTime.Now,
                State = Enum.AssignmentState.WaitingForAcceptance,
                Note = "test"
            };
        }
    }
}
