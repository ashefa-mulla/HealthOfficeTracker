using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessService.Custom.Agent
{
    public class DeviceService : EntityService<TblDevice>, IDeviceService
    {
        private readonly IGenericStoredProcedureRepository<TblDevice> spRepository;
        private readonly IGenericRepository<TblDevice> repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly ILogger<DeviceService> logger;

        public DeviceService(IUnitOfWork _unitOfWork, IGenericRepository<TblDevice> _repository,
            IGenericStoredProcedureRepository<TblDevice> _spRepository, ILogger<DeviceService> _logger)
            : base(_unitOfWork, _repository, _spRepository)
        {
            unitOfWork = _unitOfWork;
            repository = _repository;
            spRepository = _spRepository;
            logger = _logger;
        }

        public async Task<TblDevice?> Get(Guid deviceId)
        {
            return await unitOfWork.ctx.TblDevices.FirstOrDefaultAsync(o => o.DeviceId == deviceId);
        }

        public async Task<bool> Inserttbl(TblDevice tbl)
        {
            try
            {
                await Create(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error inserting Device {deviceId}", tbl.DeviceId);
                throw;
            }
        }

        public async Task<bool> Updatetbl(TblDevice tbl)
        {
            try
            {
                await Update(tbl);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating Device {deviceId}", tbl.DeviceId);
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
                logger.LogError(ex, "Error deleting Agent {deviceId}", deviceId);
                throw;
            }
        }

        public async Task<IEnumerable<sp_employee_clockedin>> GetClockedIn(int empid)
        {
            SqlParameter param = new SqlParameter("@empid", empid);
            try
            {
                return await spRepository.ExecWithStoreProcedureAsync<sp_employee_clockedin>("exec sp_employee_clockedin @empid", param);
            }
            catch (Exception Ex)
            {
                logger.LogError(Ex, "Error in getting ClockedIn Data");
                throw;
            }
        }
    }
}