using BusinessApp.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace BusinessData.DataContext;

public partial class BusinessDbContext : DbContext
{
    public BusinessDbContext()
    {
    }

    public BusinessDbContext(DbContextOptions<BusinessDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AspNetRole> AspNetRoles { get; set; }

    public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

    public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<TrustedDevice> TrustedDevices { get; set; }

    public virtual DbSet<OauthAuthorizationCode> OauthAuthorizationCodes { get; set; }

    public virtual DbSet<TblAccountCategory> TblAccountCategories { get; set; }

    public virtual DbSet<TblBankDemo> TblBankDemos { get; set; }

    public virtual DbSet<TblBankMaster> TblBankMasters { get; set; }

    public virtual DbSet<TblChequeRequest> TblChequeRequests { get; set; }

    public virtual DbSet<TblCity> TblCities { get; set; }

    public virtual DbSet<TblClientProjectAccess> TblClientProjectAccesses { get; set; }

    public virtual DbSet<TblCompany> TblCompanies { get; set; }

    public virtual DbSet<TblCompanyBranch> TblCompanyBranches { get; set; }

    public virtual DbSet<TblCostCentre> TblCostCentres { get; set; }

    public virtual DbSet<TblCountry> TblCountries { get; set; }

    public virtual DbSet<TblDesignation> TblDesignations { get; set; }

    public virtual DbSet<TblEmployeeHourlyrate> TblEmployeeHourlyrates { get; set; }

    public virtual DbSet<TblEmployeeMatrix> TblEmployeeMatrices { get; set; }

    public virtual DbSet<TblEmployeeTemplate> TblEmployeeTemplates { get; set; }

    public virtual DbSet<TblEmployer> TblEmployers { get; set; }

    public virtual DbSet<TblEvaluationLock> TblEvaluationLocks { get; set; }

    public virtual DbSet<TblEvaluationQuestion> TblEvaluationQuestions { get; set; }

    public virtual DbSet<TblEvaluationQuestionsCopy1> TblEvaluationQuestionsCopy1s { get; set; }

    public virtual DbSet<TblEvaluationSubmission> TblEvaluationSubmissions { get; set; }

    public virtual DbSet<TblEvaluationSubmissionCopy> TblEvaluationSubmissionCopies { get; set; }

    public virtual DbSet<TblEvent> TblEvents { get; set; }

    public virtual DbSet<TblLeaveMaster> TblLeaveMasters { get; set; }

    public virtual DbSet<TblLeaveTransaction> TblLeaveTransactions { get; set; }

    public virtual DbSet<TblLog> TblLogs { get; set; }

    public virtual DbSet<TblMatrix4team> TblMatrix4teams { get; set; }

    public virtual DbSet<TblMatrix4teamAnswer> TblMatrix4teamAnswers { get; set; }

    public virtual DbSet<TblMatrixteamSummary> TblMatrixteamSummaries { get; set; }

    public virtual DbSet<TblNotification> TblNotifications { get; set; }

    public virtual DbSet<TblOrderType> TblOrderTypes { get; set; }

    public virtual DbSet<TblPoReferanceDocument> TblPoReferanceDocuments { get; set; }

    public virtual DbSet<TblPodetail> TblPodetails { get; set; }

    public virtual DbSet<TblPodetails03072021> TblPodetails03072021s { get; set; }

    public virtual DbSet<TblPopayBy> TblPopayBies { get; set; }

    public virtual DbSet<TblProjectCategory> TblProjectCategories { get; set; }

    public virtual DbSet<TblProjectedvsActual> TblProjectedvsActuals { get; set; }

    public virtual DbSet<TblProjectedvsActual2024> TblProjectedvsActual2024s { get; set; }

    public virtual DbSet<TblProjectedvsActualCopy1> TblProjectedvsActualCopy1s { get; set; }

    public virtual DbSet<TblProjectedvsActualDlt> TblProjectedvsActualDlts { get; set; }

    public virtual DbSet<TblPunchDetail> TblPunchDetails { get; set; }

    public virtual DbSet<TblPunchDetailTodo> TblPunchDetailTodos { get; set; }

    public virtual DbSet<TblPurchaseOrderDetail> TblPurchaseOrderDetails { get; set; }

    public virtual DbSet<TblSnailMail> TblSnailMails { get; set; }

    public virtual DbSet<TblSnapshot> TblSnapshots { get; set; }

    public virtual DbSet<TblState> TblStates { get; set; }

    public virtual DbSet<TblTaskList> TblTaskLists { get; set; }

    public virtual DbSet<TblTaskListCopy1> TblTaskListCopy1s { get; set; }

    public virtual DbSet<TblTimezone> TblTimezones { get; set; }

    public virtual DbSet<TblToptrackerTask> TblToptrackerTasks { get; set; }

    public virtual DbSet<TblTrackerProject> TblTrackerProjects { get; set; }

    public virtual DbSet<TblTrackerSubProject> TblTrackerSubProjects { get; set; }

    public virtual DbSet<TblTrackerSubProjectCategory> TblTrackerSubProjectCategories { get; set; }

    public virtual DbSet<TblUserMaster> TblUserMasters { get; set; }

    public virtual DbSet<TblUserType> TblUserTypes { get; set; }

    public virtual DbSet<TblVandorAccount> TblVandorAccounts { get; set; }

    public virtual DbSet<TblVandorAccountNumber> TblVandorAccountNumbers { get; set; }

    public virtual DbSet<TblVoupcomingEvent> TblVoupcomingEvents { get; set; }

    public virtual DbSet<VCtccalculation> VCtccalculations { get; set; }

    public virtual DbSet<VEmployeeTrackinghour> VEmployeeTrackinghours { get; set; }

    public virtual DbSet<VEmptasklist> VEmptasklists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=208.109.246.185; Persist Security Info=True; User ID=sa; Initial Catalog=EmployerDB; password=9R+3N2,fnhcF;trustservercertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AspNetRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_dbo.AspNetRoles");
        });

        modelBuilder.Entity<AspNetUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_dbo.AspNetUsers");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Isactive).HasDefaultValue(true);
            entity.Property(e => e.LastLoginAt).HasDefaultValueSql("(NULL)");

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "AspNetUserRole",
                    r => r.HasOne<AspNetRole>().WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId"),
                    l => l.HasOne<AspNetUser>().WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId").HasName("PK_dbo.AspNetUserRoles");
                        j.ToTable("AspNetUserRoles");
                        j.IndexerProperty<string>("UserId").HasMaxLength(128);
                        j.IndexerProperty<string>("RoleId").HasMaxLength(128);
                    });
        });

        modelBuilder.Entity<AspNetUserClaim>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_dbo.AspNetUserClaims");

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserClaims).HasConstraintName("FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId");
        });

        modelBuilder.Entity<AspNetUserLogin>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey, e.UserId }).HasName("PK_dbo.AspNetUserLogins");

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserLogins)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
        });

        modelBuilder.Entity<TblCity>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.State).WithMany(p => p.TblCities)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_City_Tbl_State");
        });

        modelBuilder.Entity<TblClientProjectAccess>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Clie__3214EC07FE2A672A");
        });

        modelBuilder.Entity<TblCompany>(entity =>
        {
            entity.HasOne(d => d.City).WithMany(p => p.TblCompanies).HasConstraintName("FK_Tbl_Company_Tbl_City");

            entity.HasOne(d => d.Country).WithMany(p => p.TblCompanies).HasConstraintName("FK_Tbl_Company_Tbl_Country");

            entity.HasOne(d => d.State).WithMany(p => p.TblCompanies).HasConstraintName("FK_Tbl_Company_Tbl_State");

            entity.HasOne(d => d.TimezoneNavigation).WithMany(p => p.TblCompanies).HasConstraintName("FK_Tbl_Company_Tbl_Timezone");
        });

        modelBuilder.Entity<TblCountry>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<TblEmployeeHourlyrate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Tbl_Employerrate");
        });

        modelBuilder.Entity<TblEmployeeMatrix>(entity =>
        {
            entity.HasOne(d => d.Employee).WithMany(p => p.TblEmployeeMatrices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_Employee_Matrix_Tbl_Employer");

            entity.HasOne(d => d.Template).WithMany(p => p.TblEmployeeMatrices).HasConstraintName("FK_Tbl_Employee_Matrix_Tbl_Employee_Template");
        });

        modelBuilder.Entity<TblEmployeeTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Tbl_Employer_Forms");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblEmployeeTemplates).HasConstraintName("FK_Tbl_Employer_Forms_Tbl_Employer");
        });

        modelBuilder.Entity<TblEmployer>(entity =>
        {
            entity.ToTable("Tbl_Employer", tb => tb.HasTrigger("af_inst_emp"));

            entity.HasOne(d => d.City).WithMany(p => p.TblEmployers).HasConstraintName("FK_Tbl_Employer_Tbl_City");

            entity.HasOne(d => d.Country).WithMany(p => p.TblEmployers).HasConstraintName("FK_Tbl_Employer_Tbl_Country");

            entity.HasOne(d => d.Designation).WithMany(p => p.TblEmployers).HasConstraintName("FK_Tbl_Employer_Tbl_Designation");

            entity.HasOne(d => d.State).WithMany(p => p.TblEmployers).HasConstraintName("FK_Tbl_Employer_Tbl_State");

            entity.HasOne(d => d.TimezoneNavigation).WithMany(p => p.TblEmployers).HasConstraintName("FK_Tbl_Employer_Tbl_Timezone");
        });

        modelBuilder.Entity<TblEvaluationLock>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Eval__3214EC27924A4152");
        });

        modelBuilder.Entity<TblEvaluationQuestion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Eval__3214EC27932210FE");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<TblEvaluationQuestionsCopy1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Eval__3214EC27C0FA39B0");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<TblEvaluationSubmission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Eval__3214EC274AEE1EBB");

            entity.Property(e => e.EvalMonth).HasDefaultValueSql("(datepart(month,getdate()))");
            entity.Property(e => e.EvalYear).HasDefaultValueSql("(datepart(year,getdate()))");
            entity.Property(e => e.WeekOfMonth).HasDefaultValueSql("(ceiling(datepart(day,getdate())/(7.0)))");
        });

        modelBuilder.Entity<TblEvaluationSubmissionCopy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Eval__3214EC27567E44C0");
        });

        modelBuilder.Entity<TblMatrix4teamAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Matr__3214EC07EB09CD15");
        });

        modelBuilder.Entity<TblMatrixteamSummary>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Matr__3214EC27A4E760F0");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<TblNotification>(entity =>
        {
            entity.HasOne(d => d.User).WithMany(p => p.TblNotifications)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_Notification_Tbl_UserMaster");
        });

        modelBuilder.Entity<TblOrderType>(entity =>
        {
            entity.HasOne(d => d.Company).WithMany(p => p.TblOrderTypes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_Order_Type_Tbl_Company");
        });

        modelBuilder.Entity<TblPodetail>(entity =>
        {
            entity.ToTable("Tbl_PODetails", tb => tb.HasTrigger("af_inst_podetail"));
        });

        modelBuilder.Entity<TblProjectedvsActual>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Proj__3214EC27AAAE0048");
        });

        modelBuilder.Entity<TblProjectedvsActual2024>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Proj__3214EC27B2B7F38B");
        });

        modelBuilder.Entity<TblProjectedvsActualCopy1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Proj__3214EC273037EF7D");
        });

        modelBuilder.Entity<TblPunchDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Tbl_PunchMaster");
        });

        modelBuilder.Entity<TblPurchaseOrderDetail>(entity =>
        {
            entity.ToTable("Tbl_purchaseOrder_Details", tb => tb.HasTrigger("af_inst_parchordr"));

            entity.HasOne(d => d.OrderType).WithMany(p => p.TblPurchaseOrderDetails)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_purchaseOrder_Details_Tbl_Order_Type");
        });

        modelBuilder.Entity<TblSnapshot>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Snap__3213E83F4296D99F");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<TblState>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code).IsFixedLength();

            entity.HasOne(d => d.Country).WithMany(p => p.TblStates)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_State_Tbl_Country");
        });

        modelBuilder.Entity<TblTaskList>(entity =>
        {
            entity.Property(e => e.ActualTime).HasDefaultValue(0);
            entity.Property(e => e.CreatedTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EtaTime).HasDefaultValue(0);
            entity.Property(e => e.UpdatedTime).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<TblTaskListCopy1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tbl_Task__3214EC270292D031");

            entity.Property(e => e.ActualTime).HasDefaultValue(0);
            entity.Property(e => e.CreatedTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EtaTime).HasDefaultValue(0);
            entity.Property(e => e.UpdatedTime).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<TblTimezone>(entity =>
        {
            entity.HasKey(e => e.NameOfTimeZone).HasName("PK_timezone");
        });

        modelBuilder.Entity<TblToptrackerTask>(entity =>
        {
            entity.ToTable("Tbl_ToptrackerTask", tb => tb.HasTrigger("af_insert_task"));

            entity.Property(e => e.ActiveInvoice).HasDefaultValue(true);
        });

        modelBuilder.Entity<TblUserMaster>(entity =>
        {
            entity.HasOne(d => d.UserTypeNavigation).WithMany(p => p.TblUserMasters)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tbl_UserMaster_usermast");
        });

        modelBuilder.Entity<TblUserType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_usertype_1");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<TblVandorAccount>(entity =>
        {
            entity.HasOne(d => d.Category).WithMany(p => p.TblVandorAccounts).HasConstraintName("FK_Tbl_VandorAccount_Tbl_AccountCategory");
        });

        modelBuilder.Entity<TblVandorAccountNumber>(entity =>
        {
            entity.HasOne(d => d.VandorAccount).WithMany(p => p.TblVandorAccountNumbers).HasConstraintName("FK_Tbl_VandorAccountNumber_Tbl_VandorAccount");
        });

        modelBuilder.Entity<VCtccalculation>(entity =>
        {
            entity.ToView("v_ctccalculation");
        });

        modelBuilder.Entity<VEmployeeTrackinghour>(entity =>
        {
            entity.ToView("v_employee_trackinghours");
        });

        modelBuilder.Entity<VEmptasklist>(entity =>
        {
            entity.ToView("v_emptasklist");
        });

        modelBuilder.Entity<TrustedDevice>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.User).WithMany(p => p.TrustedDevices).HasConstraintName("FK_TrustedDevices_AspNetUsers");
        });

        modelBuilder.Entity<OauthAuthorizationCode>(entity =>
        {
            entity.HasOne(d => d.User).WithMany(p => p.OauthAuthorizationCodes).HasConstraintName("FK_OAuthAuthorizationCode_AspNetUsers");
        });

        OnModelCreatingPartial(modelBuilder);
        modelBuilder.Entity<GetUserId>().HasNoKey();
        modelBuilder.Entity<GetAllAccountCategory_Result>().HasNoKey();
        modelBuilder.Entity<GetAllBankDetail_Result>().HasNoKey();
        modelBuilder.Entity<GetCountries_Result>().HasNoKey();
        modelBuilder.Entity<GetStates_Result>().HasNoKey();
        modelBuilder.Entity<GetCities_Result>().HasNoKey();
        modelBuilder.Entity<GetDesignation_Result>().HasNoKey();
        modelBuilder.Entity<GetCompanyBranchListByCompanyID_Result>().HasNoKey();
        modelBuilder.Entity<GetEmployeeByUserID_Result>().HasNoKey();
        modelBuilder.Entity<GetOffsetByEmployeeID_Result>().HasNoKey();
        modelBuilder.Entity<GetEmployerList_Result>().HasNoKey();
        modelBuilder.Entity<GetCountries_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerProject_Result>().HasNoKey();
        modelBuilder.Entity<GetCompanies_Result>().HasNoKey();
        modelBuilder.Entity<GetPurchaseOrderList_Result>().HasNoKey();
        modelBuilder.Entity<GetPurchaseOrderListbyFilter_Result>().HasNoKey();
        modelBuilder.Entity<GetPurchaseOrderReport_Result>().HasNoKey();
        modelBuilder.Entity<GetPurchaseOrderRefDocList_Result>().HasNoKey();
        modelBuilder.Entity<GetAllCostCentre_Result>().HasNoKey();
        modelBuilder.Entity<GetPOPaymentDueDate_Result>().HasNoKey();
        modelBuilder.Entity<POPaymentDueDateStmnt_Result>().HasNoKey();
        modelBuilder.Entity<GetPOPayBy_Result>().HasNoKey();
        modelBuilder.Entity<GetSnailMail_Result>().HasNoKey();
        modelBuilder.Entity<GetAllVandorAccount_Result>().HasNoKey();
        modelBuilder.Entity<GetVendorAccountNumberByVendorID_Result>().HasNoKey();
        modelBuilder.Entity<GetVOUpcomingEvents_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerSubProject_Result>().HasNoKey();
        modelBuilder.Entity<GetProjectsList_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerSubProjectcategory_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerSubProjectcategoryWithProject_Result>().HasNoKey();
        modelBuilder.Entity<GetAllChequeRequest_Result>().HasNoKey();
        modelBuilder.Entity<GetAllBankList_Result>().HasNoKey();
        modelBuilder.Entity<GetTopTrackerTaskEntry_Result>().HasNoKey();
        modelBuilder.Entity<GetProjectTaskWithDuration_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerSummarybyMonth_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerTaskbyMonth_Result>().HasNoKey();
        modelBuilder.Entity<GetAttendanceReport_Result>().HasNoKey();
        modelBuilder.Entity<GetSummaryOfEmployeeTask_Result>().HasNoKey();
        modelBuilder.Entity<GetActiveLogOfEmployee_Result>().HasNoKey();
        modelBuilder.Entity<GetTopTrackerTaskEntrywithtasklistid_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerProjectwithprojectid_Result>().HasNoKey();
        modelBuilder.Entity<GetInvoiceDetailbyemployer_Result>().HasNoKey();
        modelBuilder.Entity<GetInvoiceDetailbysubproject_Result>().HasNoKey();
        modelBuilder.Entity<GetEmployeeTaskSummaryByDate_Result>().HasNoKey();
        modelBuilder.Entity<GetDateTimeForClockInOut_Result>().HasNoKey();
        modelBuilder.Entity<GetPunchDetailTodoByEmpID_Result>().HasNoKey();
        modelBuilder.Entity<GetPuncDetailTodoIDForTodo_Result>().HasNoKey();
        modelBuilder.Entity<GetCompanyBranchListByCompanyID_Result>().HasNoKey();
        modelBuilder.Entity<GetUserLogWithCaptureImg_Result>().HasNoKey();
        modelBuilder.Entity<GetPunchIDForClockOut_Result>().HasNoKey();
        modelBuilder.Entity<GetUserLogNotification_Result>().HasNoKey();
        modelBuilder.Entity<GetNotificationDetailByUserID_Result>().HasNoKey();
        modelBuilder.Entity<GetCurrentMonthBirthDay_Result>().HasNoKey();
        modelBuilder.Entity<GetVOEventsNotification_Result>().HasNoKey();
        modelBuilder.Entity<GetEmpLeaveBalance_Result>().HasNoKey();
        modelBuilder.Entity<GetTodayLeaveList_Result>().HasNoKey();
        modelBuilder.Entity<GetTaskListDetail_Result>().HasNoKey();
        modelBuilder.Entity<GetEmployerName_Result>().HasNoKey();
        modelBuilder.Entity<GetTaskListForUser_Result>().HasNoKey();
        modelBuilder.Entity<GetLeaveMasterList_Result>().HasNoKey();
        modelBuilder.Entity<GetUserLogReport_Result>().HasNoKey();
        modelBuilder.Entity<GetUserLogReportByEmpID_Result>().HasNoKey();
        modelBuilder.Entity<GetLeaveTransactionList_Result>().HasNoKey();
        modelBuilder.Entity<GetUserLogReportByEmpID_Result>().HasNoKey();
        modelBuilder.Entity<GetEmployeeBreakupsTaskSummaryByDate_Result>().HasNoKey();
        modelBuilder.Entity<GetUtilizationReportwithProject_Result>().HasNoKey();
        modelBuilder.Entity<GetUtilizationReportDetailwithProject_Result>().HasNoKey();
        modelBuilder.Entity<sp_getpopaymentduedate>().HasNoKey();
        modelBuilder.Entity<sp_getpopaymentduedatenotification>().HasNoKey();
        modelBuilder.Entity<sp_GetEmployeeTaskSummaryByDate_Result>().HasNoKey();
        modelBuilder.Entity<GetUserTrackerTaskbyMonth_Result>().HasNoKey();
        //modelBuilder.Entity<GetUserTrackerTaskbyMonth__Result>().HasNoKey();
        modelBuilder.Entity<GetUtilizationReportDetailwithProjectbyEmployee_Result>().HasNoKey();
        modelBuilder.Entity<GetTrackerTaskbyMonthbyGJ_Result>().HasNoKey();
        modelBuilder.Entity<GetCompanyincomevsCompanycost_Result>().HasNoKey();
        modelBuilder.Entity<GetActiveLogOfEmployee_VC_Result>().HasNoKey();
        modelBuilder.Entity<get_trackerprojectfor_vc_Result>().HasNoKey();
        modelBuilder.Entity<getclientgraphreport_Result>().HasNoKey();
        modelBuilder.Entity<sp_gettodotasklist_Result>().HasNoKey();
        modelBuilder.Entity<GetTaskListForUserPendingList_Result>().HasNoKey();
        modelBuilder.Entity<sp_gettasklistforall_Result>().HasNoKey();
        modelBuilder.Entity<sp_getmonth>().HasNoKey();
        modelBuilder.Entity<sp_getyear>().HasNoKey();
        modelBuilder.Entity<UpdateTrackerSummarybyMonth_ProjectedvsActual_Result>().HasNoKey();
        modelBuilder.Entity<sp_get_userforfeedbackform_Results>().HasNoKey();
        modelBuilder.Entity<sp_get_questionsforfeedbackform_Results>().HasNoKey();
        modelBuilder.Entity<GeTeamList_Results>().HasNoKey();
        modelBuilder.Entity<sp_GetEmployeeTaskSummary_Yesterday_Results>().HasNoKey();
        modelBuilder.Entity<GetTaskListForUserwithPegination_Results>().HasNoKey();
        modelBuilder.Entity<GetTaskCountListForUserwithPegination_Results>().HasNoKey();
        modelBuilder.Entity<GetBillableHoursAndAmountByProject_Result>().HasNoKey();
        modelBuilder.Entity<sp_getcurrentmonthOutstandingByAdmin_Results>().HasNoKey();
        modelBuilder.Entity<sp_getadminprojectsummaryfordashboard_Results>().HasNoKey();
        modelBuilder.Entity<GetActiveLogOfClientProject_Results>().HasNoKey();
        modelBuilder.Entity<getfeedbackformmentionpointssummary>().HasNoKey();
        modelBuilder.Entity<sp_getbelow3hremployeedailyduration_Results>().HasNoKey();
        modelBuilder.Entity<sp_getemployeesnottrackedyesterday_results>().HasNoKey();
        modelBuilder.Entity<sp_getevaluationquestionsbyemployee_Results>().HasNoKey();
        modelBuilder.Entity<sp_getevaluationsubmissionsforedit_Results>().HasNoKey();
        modelBuilder.Entity<sp_getlast8evaluationssummary_Results>().HasNoKey();
        modelBuilder.Entity<sp_getmonthlyevaluationsummary_Result>().HasNoKey();
        modelBuilder.Entity<sp_getmonthlyevaluationsummaryaddedit_Result>().HasNoKey();
        modelBuilder.Entity<sp_getmonthlyevaluationreportsummary_Results>().HasNoKey();
        modelBuilder.Entity<sp_getonlineemployeedashboardsummary_Result>().HasNoKey();
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
