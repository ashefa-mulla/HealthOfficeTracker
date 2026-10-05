using System;
using AutoMapper;
using BusinessApp.Data;
using BusinessData.DataContext;
using BusinessApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace BusinessApp.Settings
{
    public class MapperConfig : AutoMapper.Profile
    {
        public MapperConfig()
        {


            CreateMap<DateTime, DateOnly>()
    .ConvertUsing(src => DateOnly.FromDateTime(src));

            CreateMap<DateOnly, DateTime>()
                .ConvertUsing(src => src.ToDateTime(TimeOnly.MinValue));


            CreateMap<TblEmployer, EmployeeModel>()
               //.ForMember(x => x.CityName, ex => ex.MapFrom(x => x.City.Name))
               //.ForMember(x => x.StateName, ex => ex.MapFrom(x => x.State.Name))
               //.ForMember(x => x.CountryName, ex => ex.MapFrom(x => x.Country.Name))
               .ReverseMap();
            
            CreateMap<TblAccountCategory, AccountCategory>()
                .ReverseMap();
            CreateMap<TblBankMaster, BankMasterModel>()
                .ReverseMap();
            CreateMap<TblUserMaster, UserModel>()
                .ReverseMap();
            CreateMap<TblTrackerProject, TrackerProjectModel>()
                .ReverseMap();
            CreateMap<PurchaseOrderModel, TblPodetail>()
               .ReverseMap();
            CreateMap<VendorAccountModel, TblVandorAccount>()
               .ReverseMap();
            CreateMap<VandorAccountNumber, TblVandorAccountNumber>()
               .ReverseMap();
            CreateMap<POReferanceDocument, TblPoReferanceDocument>()
               .ReverseMap();
            CreateMap<VOUpcomingEventsModel, TblVoupcomingEvents>()
               .ReverseMap();
            CreateMap<TrackerSubProjectModel, TblTrackerSubProject>()
               .ReverseMap();
            CreateMap<TrackerSubProjectCategoryModel, TblTrackerSubProjectCategory>()
               .ReverseMap();
            CreateMap<ChequeRequestModel, TblChequeRequest>()
             .ReverseMap();
            CreateMap<ChequeRequest, TblChequeRequest>()
               .ReverseMap();
            CreateMap<UtilizationTrackerModel, TblToptrackerTask>()
               .ReverseMap();
            CreateMap<PunchDetailTodo, TblPunchDetailTodo>()
               .ReverseMap();
            CreateMap<PunchDetail, TblPunchDetail>()
               .ReverseMap();
            CreateMap<TaskList, TblTaskList>()
               .ReverseMap();
            CreateMap<LeaveMaster, TblLeaveMaster>()
               .ReverseMap();
            CreateMap<LeaveTransaction, TblLeaveTransaction>()
             .ReverseMap();
            CreateMap<Matrix4teamAnswerModel, TblMatrix4teamAnswer>()
             .ReverseMap();
            CreateMap<EvaluationSubmissionModel, TblEvaluationSubmission>()
            .ReverseMap();
            //CreateMap<EvaluationQuestionModel, TblEvaluationQuestions>().ReverseMap();
            CreateMap<EvaluationQuestionModel, TblEvaluationQuestion>()
    .ForMember(d => d.CreatedAt, o => o.Ignore())
    .ReverseMap();

            CreateMap<EvaluationLockModel, TblEvaluationLock>().ReverseMap();
            
        }
    }
}
