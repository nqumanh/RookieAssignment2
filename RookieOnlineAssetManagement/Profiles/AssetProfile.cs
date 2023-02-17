using AutoMapper;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;

namespace RookieOnlineAssetManagement.Profiles;
public class AssetProfile : Profile
{
    public AssetProfile()
    {
        CreateMap<Asset, AssetDTO>()
            .ForMember(des => des.Category, src => src.MapFrom(ent => (ent.Category.Name)));
        CreateMap<Asset, AssetModel>().ReverseMap();
        CreateMap<AssetDto, Asset>().ReverseMap().ForMember(des => des.CategoryName, src => src.MapFrom(ent => (ent.Category.Name)));
        CreateMap<AssetCreateDTO, Asset>().ReverseMap();
        CreateMap<AssetEditDTO, Asset>();
    }
}