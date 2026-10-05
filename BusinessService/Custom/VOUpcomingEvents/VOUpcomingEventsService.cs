using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessData.DataContext;
using BusinessData.CommonRepository;
//using AvailAnalytics.Service.Common;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
using BusinessService.Common;

namespace BusinessService.Custom.VOUpcomingEvents
{
    public class VOUpcomingEventsService : EntityService<TblVoupcomingEvents>, IVOUpcomingEventsService
    {
        readonly IGenericStoredProcedureRepository<TblVoupcomingEvents> spRepository;
        readonly IGenericRepository<TblVoupcomingEvents> repository;
        readonly IUnitOfWork unitOfWork;



        public VOUpcomingEventsService(IUnitOfWork _unitOfWork, IGenericRepository<TblVoupcomingEvents> _repository, IGenericStoredProcedureRepository<TblVoupcomingEvents> _spRepository)
         : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;

        }
        public async Task<TblVoupcomingEvents> Get(int ID)
        {

            return await repository.SelectById(ID);
        }

        public async Task<bool> tblinsert(TblVoupcomingEvents tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tblupdate(TblVoupcomingEvents tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> tbldelete(int id)
        {
            try
            {
                await Delete(await Get(id));
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
        public async Task<IEnumerable<GetVOUpcomingEvents_Result>> GetVOUpcomingEvents()
        {
            //return _msBankMasterRepository.ExecWithStoreProcedure<GetAllBankMaster_Result>("GetAllBankMaster");
            return await spRepository.ExecWithStoreProcedureAsync<GetVOUpcomingEvents_Result>("exec GetVOUpcomingEvents");
        }
    }
}
