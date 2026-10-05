//using AutoMapper;
//using BusinessApp.Hubs;
//using BusinessApp.Models;
//using BusinessData.CommonRepository;
//using BusinessData.DataContext;
//using BusinessService.Custom.AccountCategory;
//using BusinessService.Custom.BankMaster;
//using BusinessService.Custom.ChequeRequest;
//using BusinessService.Custom.Common;
//using BusinessService.Custom.DailyToDo;
//using BusinessService.Custom.Employee;
//using BusinessService.Custom.Evaluation;
//using BusinessService.Custom.EvaluationLock;
//using BusinessService.Custom.EvaluationQuestions;
//using BusinessService.Custom.Feedbackform;
//using BusinessService.Custom.LeaveMaster;
//using BusinessService.Custom.LeaveTransaction;
//using BusinessService.Custom.Notification;
//using BusinessService.Custom.ProjectedvsActual;
//using BusinessService.Custom.PunchDetail;
//using BusinessService.Custom.PurchaseOrder;
//using BusinessService.Custom.PurchaseOrderReferenceDocument;
//using BusinessService.Custom.TaskActivity;
//using BusinessService.Custom.TrackerProject;
//using BusinessService.Custom.TrackerSubProject;
//using BusinessService.Custom.TrackerSubProjectCategory;
//using BusinessService.Custom.User;
//using BusinessService.Custom.UtilizationTracker;
//using BusinessService.Custom.VendorAccount;
//using BusinessService.Custom.VendorAccountNumber;
//using BusinessService.Custom.VOUpcomingEvents;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.FileProviders;
//using Microsoft.Extensions.Hosting;
//using Microsoft.IdentityModel.Tokens;
//using Newtonsoft.Json;
//using System;
//using System.IO;
//using System.Text;
//using System.Threading.Tasks;

//var builder = WebApplication.CreateBuilder(args);

//// ----------------------------------------------------
//// Configuration
//// ----------------------------------------------------
//builder.Services.Configure<ApplicationSettings>(
//    builder.Configuration.GetSection("ApplicationSettings"));

//// ----------------------------------------------------
//// Identity DB Context
//// ----------------------------------------------------
//builder.Services.AddDbContext<AuthenticationDbContext>(options =>
//    options.UseSqlServer(
//        builder.Configuration.GetConnectionString("IdentityDbConnetion")));

//// ----------------------------------------------------
//// Identity
//// ----------------------------------------------------
//builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
//    .AddEntityFrameworkStores<AuthenticationDbContext>()
//    .AddDefaultTokenProviders();

//builder.Services.Configure<PasswordHasherOptions>(options =>
//{
//    options.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2;
//});

//builder.Services.Configure<IdentityOptions>(options =>
//{
//    options.Password.RequiredLength = 4;
//    options.Password.RequireLowercase = false;
//    options.Password.RequireNonAlphanumeric = false;
//    options.Password.RequireUppercase = false;
//    options.Password.RequireDigit = false;
//});

//// ----------------------------------------------------
//// JWT Authentication
//// ----------------------------------------------------
//var key = Encoding.UTF8.GetBytes(
//    builder.Configuration["ApplicationSettings:App_Token"]!);

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = false;
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(key),
//        ValidateIssuer = false,
//        ValidateAudience = false,
//        ClockSkew = TimeSpan.Zero
//    };
//    //FOR SIGNALR
//    options.Events = new JwtBearerEvents
//    {
//        OnMessageReceived = context =>
//        {
//            var accessToken = context.Request.Query["access_token"];

//            // adjust path if your hub name is different
//            var path = context.HttpContext.Request.Path;
//            if (!string.IsNullOrEmpty(accessToken) &&
//                path.StartsWithSegments("/presenceHub"))
//            {
//                context.Token = accessToken;
//            }

//            return Task.CompletedTask;
//        }
//    };
//});

//// ----------------------------------------------------
//// Business DB Context
//// ----------------------------------------------------
//builder.Services.AddDbContext<BusinessDbContext>(options =>
//    options.UseSqlServer(
//        builder.Configuration.GetConnectionString("BusinessDbConnetion")));

//// ----------------------------------------------------
//// AutoMapper
//// ----------------------------------------------------
//builder.Services.AddAutoMapper(typeof(Program));

//// ----------------------------------------------------
//// Dependency Injection
//// ----------------------------------------------------
//builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
//builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
//builder.Services.AddScoped(typeof(IGenericStoredProcedureRepository<>), typeof(GenericRepository<>));

//builder.Services.AddScoped<IAccountCategoryService, AccountCategoryService>();
//builder.Services.AddScoped<IEmployeeService, EmployeeService>();
//builder.Services.AddScoped<IBankMasterService, BankMasterService>();
//builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<ICommonService, CommonService>();
//builder.Services.AddScoped<ITrackerProjectService, TrackerProjectService>();
//builder.Services.AddScoped<IVendorAccountService, VendorAccountService>();
//builder.Services.AddScoped<IVendorAccountNumberService, VendorAccountNumberService>();
//builder.Services.AddScoped<IPurchaseOrderReferenceDocumentService, PurchaseOrderReferenceDocumentService>();
//builder.Services.AddScoped<IVOUpcomingEventsService, VOUpcomingEventsService>();
//builder.Services.AddScoped<ITrackerSubProjectService, TrackerSubProjectService>();
//builder.Services.AddScoped<ITrackerSubProjectCategoryService, TrackerSubProjectCategoryService>();
//builder.Services.AddScoped<IChequeRequestService, ChequeRequestService>();
//builder.Services.AddScoped<IUtilizationTrackerService, UtilizationTrackerService>();
//builder.Services.AddScoped<IPunchDetailService, PunchDetailService>();
//builder.Services.AddScoped<IDailyToDoService, DailyToDoService>();
//builder.Services.AddScoped<INotificationService, NotificationService>();
//builder.Services.AddScoped<ITaskListService, TaskListService>();
//builder.Services.AddScoped<ILeaveMasterService, LeaveMasterService>();
//builder.Services.AddScoped<ILeaveTransactionService, LeaveTransactionService>();
//builder.Services.AddScoped<IProjectedvsActualService, ProjectedvsActualService>();
//builder.Services.AddScoped<IFeedbackformService, FeedbackformService>();
//builder.Services.AddScoped<IEvaluationService, EvaluationService>();
//builder.Services.AddScoped<IEvaluationQuestionsService, EvaluationQuestionsService>();
//builder.Services.AddScoped<IEvaluationLockService, EvaluationLockService>();

//builder.Services.AddSingleton<UserPresenceTracker>();
//// ----------------------------------------------------
//// CORS (Angular)
//// ----------------------------------------------------
//var allowedOrigins = builder.Configuration
//    .GetSection("ApplicationSettings:Dev_Urls")
//    .Get<string[]>();

//if (allowedOrigins == null || allowedOrigins.Length == 0)
//{
//    throw new Exception(
//        "CORS configuration error: ApplicationSettings:Dev_Urls is missing or empty");
//}

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAngular", policy =>
//    {
//        policy
//            .WithOrigins("http://localhost:4200")
//            .AllowAnyMethod()
//            .AllowAnyHeader()
//            .AllowCredentials();
//    });
//});





//// ----------------------------------------------------
//// Controllers
//// ----------------------------------------------------
//builder.Services.AddControllers()
//    .AddNewtonsoftJson(options =>
//        options.SerializerSettings.ReferenceLoopHandling =
//            ReferenceLoopHandling.Ignore);
////For SingleR
//builder.Services.AddSignalR();

//// ----------------------------------------------------
//// Build App
//// ----------------------------------------------------
//var app = builder.Build();

//// ----------------------------------------------------
//// Middleware
//// ----------------------------------------------------


//if (app.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//}

///* REQUIRED */
//app.UseRouting();

///* REQUIRED: enable CORS middleware */
//app.UseCors("AllowAngular");

///* HTTPS AFTER CORS */
//app.UseHttpsRedirection();

//app.UseAuthentication();
//app.UseAuthorization();

//app.UseStaticFiles();

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(
//        Path.Combine(Directory.GetCurrentDirectory(), "FileServer")),
//    RequestPath = "/FileServer"
//});

///* APPLY CORS POLICY TO CONTROLLERS */
//app.MapControllers()
//   .RequireCors("AllowAngular");

////ADD AFTER CONTROLLERS
//app.MapHub<PresenceHub>("/presenceHub");

//app.Run();













using AutoMapper;
using BusinessApp.Hubs;
using BusinessApp.Models;
using BusinessApp.Services.Jwt;
using BusinessApp.Services.Mfa;
using BusinessApp.Utilities;
using BusinessData.CommonRepository;
using BusinessData.DataContext;
using BusinessService.Custom.AccountCategory;
using BusinessService.Custom.BankMaster;
using BusinessService.Custom.ChequeRequest;
using BusinessService.Custom.Common;
using BusinessService.Custom.DailyToDo;
using BusinessService.Custom.DiviceTrustscheck;
using BusinessService.Custom.Employee;
using BusinessService.Custom.Evaluation;
using BusinessService.Custom.EvaluationLock;
using BusinessService.Custom.EvaluationQuestions;
using BusinessService.Custom.Feedbackform;
using BusinessService.Custom.LeaveMaster;
using BusinessService.Custom.LeaveTransaction;
using BusinessService.Custom.Notification;
using BusinessService.Custom.OAuthorizationCode;
using BusinessService.Custom.ProjectedvsActual;
using BusinessService.Custom.PunchDetail;
using BusinessService.Custom.PurchaseOrder;
using BusinessService.Custom.PurchaseOrderReferenceDocument;
using BusinessService.Custom.TaskActivity;
using BusinessService.Custom.TrackerProject;
using BusinessService.Custom.TrackerSubProject;
using BusinessService.Custom.TrackerSubProjectCategory;
using BusinessService.Custom.User;
using BusinessService.Custom.UtilizationTracker;
using BusinessService.Custom.VendorAccount;
using BusinessService.Custom.VendorAccountNumber;
using BusinessService.Custom.VOUpcomingEvents;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

#region Configuration

builder.Services.Configure<ApplicationSettings>(
    builder.Configuration.GetSection("ApplicationSettings"));

#endregion

#region Database Contexts

builder.Services.AddDbContext<AuthenticationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("IdentityDbConnetion")
        ?? throw new Exception("IdentityDbConnetion missing")));

builder.Services.AddDbContext<BusinessDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("BusinessDbConnetion")
        ?? throw new Exception("BusinessDbConnetion missing")));

#endregion

#region Identity

//builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
//    .AddEntityFrameworkStores<AuthenticationDbContext>()
//    .AddDefaultTokenProviders();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthenticationDbContext>()
    .AddDefaultTokenProviders();


builder.Services.Configure<PasswordHasherOptions>(options =>
{
    options.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV2;
});

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredLength = 4;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireDigit = false;
});

#endregion

#region JWT Authentication

var token = builder.Configuration["Jwt:SecretKey"]
    ?? builder.Configuration["ApplicationSettings:App_Token"];
if (string.IsNullOrWhiteSpace(token))
{
    throw new Exception("ApplicationSettings:App_Token or Jwt:SecretKey is missing");
}

var key = Encoding.UTF8.GetBytes(token);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };

    // SignalR JWT support
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/presenceHub"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});

#endregion

#region AutoMapper

builder.Services.AddAutoMapper(typeof(Program));

#endregion

#region Dependency Injection

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped(typeof(IGenericStoredProcedureRepository<>), typeof(GenericRepository<>));

builder.Services.AddScoped<IAccountCategoryService, AccountCategoryService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IBankMasterService, BankMasterService>();
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICommonService, CommonService>();
builder.Services.AddScoped<ITrackerProjectService, TrackerProjectService>();
builder.Services.AddScoped<IVendorAccountService, VendorAccountService>();
builder.Services.AddScoped<IVendorAccountNumberService, VendorAccountNumberService>();
builder.Services.AddScoped<IPurchaseOrderReferenceDocumentService, PurchaseOrderReferenceDocumentService>();
builder.Services.AddScoped<IVOUpcomingEventsService, VOUpcomingEventsService>();
builder.Services.AddScoped<ITrackerSubProjectService, TrackerSubProjectService>();
builder.Services.AddScoped<ITrackerSubProjectCategoryService, TrackerSubProjectCategoryService>();
builder.Services.AddScoped<IChequeRequestService, ChequeRequestService>();
builder.Services.AddScoped<IUtilizationTrackerService, UtilizationTrackerService>();
builder.Services.AddScoped<IPunchDetailService, PunchDetailService>();
builder.Services.AddScoped<IDailyToDoService, DailyToDoService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ITaskListService, TaskListService>();
builder.Services.AddScoped<ILeaveMasterService, LeaveMasterService>();
builder.Services.AddScoped<ILeaveTransactionService, LeaveTransactionService>();
builder.Services.AddScoped<IProjectedvsActualService, ProjectedvsActualService>();
builder.Services.AddScoped<IFeedbackformService, FeedbackformService>();
builder.Services.AddScoped<IEvaluationService, EvaluationService>();
builder.Services.AddScoped<IEvaluationQuestionsService, EvaluationQuestionsService>();
builder.Services.AddScoped<IEvaluationLockService, EvaluationLockService>();

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IMfaService, MfaService>();
builder.Services.AddScoped<IDeviceTrustService, DeviceTrustService>();
builder.Services.AddScoped<IOauthAuthorizationService, OauthAuthorizationService>();

builder.Services.AddHttpClient();

builder.Services.AddSingleton<UserPresenceTracker>();

#endregion

#region CORS

var allowedOrigins = builder.Configuration
    .GetSection("ApplicationSettings:Dev_Urls")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
              {
                  if (string.IsNullOrEmpty(origin)) return false;
                  var uri = new Uri(origin);
                  return uri.Host == "localhost" ||
                         uri.Host == "127.0.0.1" ||
                         Array.Exists(allowedOrigins, o => string.Equals(o, origin, StringComparison.OrdinalIgnoreCase)) ||
                         origin == "https://app.govirtualnow.in/";
              })
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
              {
                  if (string.IsNullOrEmpty(origin)) return false;
                  var uri = new Uri(origin);
                  return uri.Host == "localhost" ||
                         uri.Host == "127.0.0.1" ||
                         Array.Exists(allowedOrigins, o => string.Equals(o, origin, StringComparison.OrdinalIgnoreCase)) ||
                         origin == "https://devapp.access2.md" ||
                         origin == "https://app.virtualclinic.md";
              })
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

#endregion

#region Controllers & SignalR

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling =
            ReferenceLoopHandling.Ignore);

builder.Services.AddSignalR();

#endregion

var app = builder.Build();

#region Middleware

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseCors("AllowSpecific");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "FileServer")),
    RequestPath = "/FileServer"
});

app.MapControllers().RequireCors("AllowSpecific");

app.MapHub<PresenceHub>("/presenceHub");

#endregion

app.Run();

