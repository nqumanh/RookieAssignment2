using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models.Assignment;
using System;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.UnitTests.TestData
{
    public class ReturnRequestTestData
    {
        public static List<ReturningRequest> ReturningRequests()
        {
            return new List<ReturningRequest>() {
                new ReturningRequest() {
                    Id = 1,
                    State = Enum.ReturningRequestState.WaitingForReturning,
                    Assignment = new Assignment(){Id = 1}
                },
             new ReturningRequest() {
                    Id = 2,
                    State = Enum.ReturningRequestState.Completed,
                    ReturnedDate = new DateTime(2022,12,11),
                    Assignment = new Assignment(){Id = 2}
                },

            };
        }

    }
}
