using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace BusinessApp.Utility
{
    public class SystemConfiguration
    {
        public static string companylogo = ConfigurationManager.AppSettings["companylogo"].ToString();
        public static string clientname = ConfigurationManager.AppSettings["ClientName"].ToString();
        public static int companyid = Convert.ToInt16(ConfigurationManager.AppSettings["CompanyID"].ToString());
        public static decimal Offset = Convert.ToInt16(ConfigurationManager.AppSettings["ESTOffset"].ToString());
        public static decimal ISTOffset = Convert.ToDecimal(ConfigurationManager.AppSettings["ISTOffset"].ToString());
        public static string FileUploadPath = ConfigurationManager.AppSettings["FILEUPLOAD"].ToString();
        public static string[] IMAGESUPPORT = ConfigurationManager.AppSettings["IMAGESUPPORT"].ToString().Split(',');
        public static int LOGOHEIGHT = Convert.ToInt32(ConfigurationManager.AppSettings["LOGOHEIGHT"].ToString());
        public static int LOGOWIDTH = Convert.ToInt32(ConfigurationManager.AppSettings["LOGOWIDTH"].ToString());
        public static string A2MDLOGO = ConfigurationManager.AppSettings["A2MDLOGO"].ToString();

        public static string password = ConfigurationManager.AppSettings["Password"].ToString();
        public static string FromEMAIL = ConfigurationManager.AppSettings["SMTPEmail"].ToString();
        public static string ToEMAILChequeRequest = ConfigurationManager.AppSettings["SMTPEmailChequeRequest"].ToString();
        public static string SMTPCC = ConfigurationManager.AppSettings["SMTPCC"].ToString();
        public static bool SendEmail = Convert.ToBoolean(ConfigurationManager.AppSettings["SendEmail"].ToString());
        public static string RegistrationTemplate = ConfigurationManager.AppSettings["RegistrationTemplate"].ToString();

       

    }
}