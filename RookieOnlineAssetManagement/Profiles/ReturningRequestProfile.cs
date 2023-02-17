using AutoMapper;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;

namespace RookieOnlineAssetManagement.Profiles;
public class ReturningRequestProfile : Profile
{
    public ReturningRequestProfile()
    {
        CreateMap<ReturningRequest, ReturningRequestCreateModel>()
            .ForMember(des => des.AcceptedById, src => src.MapFrom(ent => (ent.AcceptedBy.Id)))
            .ForMember(des => des.RequestById, src => src.MapFrom(ent => (ent.RequestedBy.Id)))
            .ForMember(des => des.AssignmentId, src => src.MapFrom(ent => (ent.Assignment.Id)));
        CreateMap<ReturningRequest, ReturningRequestDTO>()
            .ForMember(des => des.AssetCode, src => src.MapFrom(ent => (ent.Assignment.Asset.AssetCode)))
            .ForMember(des => des.AssetName, src => src.MapFrom(ent => (ent.Assignment.Asset.AssetName)))
            .ForMember(des => des.RequestedBy, src => src.MapFrom(ent => (ent.RequestedBy.UserName)))
            .ForMember(des => des.AcceptedBy, src => src.MapFrom(ent => (ent.AcceptedBy.UserName))).ReverseMap();
    }
}

