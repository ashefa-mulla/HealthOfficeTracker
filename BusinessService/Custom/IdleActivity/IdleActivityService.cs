using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;


namespace BusinessService.Custom.IdleActivity
{
    public class IdleActivityService : EntityService<TblIdleActivity>, IIdleActivityService
    {
        private readonly IGenericStoredProcedureRepository<TblIdleActivity> spRepository;
        private readonly IGenericRepository<TblIdleActivity> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly ILogger<IdleActivityService> logger;

        public IdleActivityService(IUnitOfWork _unitOfWork, IGenericRepository<TblIdleActivity> _repository,
            IGenericStoredProcedureRepository<TblIdleActivity> _spRepository, ILogger<IdleActivityService> _logger)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
            logger = _logger;
        }

        public async Task<TblIdleActivity?> Get(Guid activityId, Guid deviceId)
        {
            return await unitOfWork.ctx.TblIdleActivities.FirstOrDefaultAsync(o => o.ActivityId == activityId && o.DeviceId == deviceId);
        }

        public async Task<bool> Inserttbl(TblIdleActivity tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error inserting IdleActivity {ActivityId} for Device {DeviceId}", tbl.ActivityId, tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Updatetbl(TblIdleActivity tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating IdleActivity {ActivityId} for Device {DeviceId}", tbl.ActivityId, tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Deletetbl(Guid activityId, Guid deviceId)
        {
            try
            {
                var data = await Get(activityId, deviceId);
                if (data == null)
                    return false;
                await Delete(data);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting IdleActivity {ActivityId} for Device {DeviceId}", activityId, deviceId);
                throw;
            }
        }
    }
}