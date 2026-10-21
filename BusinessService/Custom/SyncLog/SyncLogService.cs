using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace BusinessService.Custom.SyncLog
{
    public class SyncLogService : EntityService<TblSyncLog>, ISyncLogService
    {
        private readonly IGenericStoredProcedureRepository<TblSyncLog> spRepository;
        private readonly IGenericRepository<TblSyncLog> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly ILogger<SyncLogService> logger;

        public SyncLogService(IUnitOfWork _unitOfWork, IGenericRepository<TblSyncLog> _repository,
            IGenericStoredProcedureRepository<TblSyncLog> _spRepository, ILogger<SyncLogService> _logger)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
            logger = _logger;
        }

        public async Task<TblSyncLog?> Get(Guid deviceId)
        {
            return await unitOfWork.ctx.TblSyncLogs.FirstOrDefaultAsync(o => o.DeviceId == deviceId);
        }

        public async Task<bool> Inserttbl(TblSyncLog tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex,"Error inserting SyncLog {deviceId}", tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Updatetbl(TblSyncLog tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating SyncLog {deviceId}", tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Deletetbl(Guid deviceId)
        {
            try
            {
                var agent = await Get(deviceId);
                if (agent == null)
                    return false;

                await Delete(agent);

                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting SyncLog {deviceId}", deviceId);
                throw;
            }
        }
    }
}