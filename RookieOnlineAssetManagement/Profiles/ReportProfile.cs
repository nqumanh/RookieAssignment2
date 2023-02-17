using AutoMapper;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System.Linq;

namespace RookieOnlineAssetManagement.Profiles
{
    public class ReportProfile : Profile
    {
        public ReportProfile()
        {
            CreateMap<Category, ReportDTO>().ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Name))
                     .ForMember(dest => dest.Available, opt => opt.MapFrom(src => src.Assets.Count(a => a.State == Enum.AssetState.Available && a.IsDisabled == false)))
                     .ForMember(dest => dest.Assigned, opt => opt.MapFrom(src => src.Assets.Count(a => a.State == Enum.AssetState.Assigned && a.IsDisabled == false)))
                     .ForMember(dest => dest.WaitingForRecycling, opt => opt.MapFrom(src => src.Assets.Count(a => a.State == Enum.AssetState.WaitingForRecycling && a.IsDisabled == false)))
                     .ForMember(dest => dest.Recycled, opt => opt.MapFrom(src => src.Assets.Count(a => a.State == Enum.AssetState.Recycled && a.IsDisabled == false)))
                     .ForMember(dest => dest.NotAvailable, opt => opt.MapFrom(src => src.Assets.Count(a => a.State == Enum.AssetState.NotAvailable && a.IsDisabled == false)))
                     .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Assets.Count));
        }
    }
}
