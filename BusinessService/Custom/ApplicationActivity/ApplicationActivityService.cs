using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;


namespace BusinessService.Custom.ApplicationActivity
{
    public class ApplicationActivityService : EntityService<TblApplicationActivity>, IApplicationActivityService
    {
        private readonly IGenericStoredProcedureRepository<TblApplicationActivity> spRepository;
        private readonly IGenericRepository<TblApplicationActivity> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly ILogger<ApplicationActivityService> logger;

        public ApplicationActivityService(IUnitOfWork _unitOfWork, IGenericRepository<TblApplicationActivity> _repository,
            IGenericStoredProcedureRepository<TblApplicationActivity> _spRepository, ILogger<ApplicationActivityService> _logger)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
            logger = _logger;
        }

        public async Task<TblApplicationActivity?> Get(Guid activityId, Guid deviceId)
        {
            return await unitOfWork.ctx.TblApplicationActivities.FirstOrDefaultAsync(o => o.ActivityId == activityId && o.DeviceId == deviceId);
        }

        public async Task<bool> Inserttbl(TblApplicationActivity tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error inserting ApplicationActivity {ActivityId} for Device {deviceId}", tbl.ActivityId, tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Updatetbl(TblApplicationActivity tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating ApplicationActivity {ActivityId} for Device {deviceId}", tbl.ActivityId, tbl.DeviceId);
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
                logger.LogError(ex, "Error deleting ApplicationActivity {ActivityId} for Device {deviceId}", activityId, deviceId);
                throw;
            }
        }
    }
}