using AutoMapper;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Models.Assignment;
using System.Linq;

namespace RookieOnlineAssetManagement.Profiles
{
    public class AssignmentProfile : Profile
    {
        public AssignmentProfile()
        {
            CreateMap<Assignment, AssignmentDTO>()
                .ForMember(des => des.AssetCode, src => src.MapFrom(ent => (ent.Asset.AssetCode)))
                .ForMember(des => des.AssetName, src => src.MapFrom(ent => (ent.Asset.AssetName)))
                .ForMember(des => des.Specification, src => src.MapFrom(ent => (ent.Asset.Specification)))
                .ForMember(des => des.AssignedTo, src => src.MapFrom(ent => (ent.AssignedToUser.UserName)))
                .ForMember(des => des.AssignedBy, src => src.MapFrom(ent => (ent.AssignedByUser.UserName)));

        CreateMap<Assignment, AssignmentViewDTO>()
            .ForMember(des => des.AssignmentId, src => src.MapFrom(ent => (ent.Id)))
            .ForMember(des => des.AssetCode, src => src.MapFrom(ent => (ent.Asset.AssetCode)))
            .ForMember(des => des.AssetName, src => src.MapFrom(ent => (ent.Asset.AssetName)))
            .ForMember(des => des.Category, src => src.MapFrom(ent => (ent.Asset.Category.Name)))
            .ForMember(dest => dest.IsWaitingForReturningRequest, opt => opt.MapFrom(src => src.ReturningRequests.Any(rq =>rq.State==Enum.ReturningRequestState.WaitingForReturning && rq.IsDisabled==false)));

            CreateMap<Assignment, AssignmentDetailDTO>()
                .ForMember(des => des.AssetCode, src => src.MapFrom(ent => (ent.Asset.AssetCode)))
                .ForMember(des => des.AssetName, src => src.MapFrom(ent => (ent.Asset.AssetName)))
                .ForMember(des => des.Specification, src => src.MapFrom(ent => (ent.Asset.Specification)))
                .ForMember(des => des.AssignedTo, src => src.MapFrom(ent => (ent.AssignedToUser.UserName)))
                .ForMember(des => des.AssignedBy, src => src.MapFrom(ent => (ent.AssignedByUser.UserName)));
            CreateMap<Assignment, AssignmentGetDTO>()
                .ForMember(dest => dest.AssetCode, opt => opt.MapFrom(src => src.Asset.AssetCode))
                .ForMember(dest => dest.AssetName, opt => opt.MapFrom(src => src.Asset.AssetName))
                .ForMember(dest => dest.AssignedBy, opt => opt.MapFrom(src => src.AssignedByUser.UserName))
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedToUser.UserName))
                .ForMember(dest => dest.Specification, opt => opt.MapFrom(src => src.Asset.Specification))
                .ForMember(dest => dest.IsWaitingForReturningRequest, opt => opt.MapFrom(src => src.ReturningRequests.Any(rq => rq.State == Enum.ReturningRequestState.WaitingForReturning && rq.IsDisabled == false)));
        }
    }
}
