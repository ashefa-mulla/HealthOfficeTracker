using BusinessApp.Models;
using Microsoft.Extensions.Options;
//using SendGrid;
//using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
//using Twilio;
//using Twilio.Types;
//using Twilio.Rest.Api.V2010.Account;

namespace BusinessApp.Settings
{
    public class EmailUtility
    {
        public async Task SendMail(string sendgridkey, string EmailTo, string EmailCc, string EmailFrom, string EmailSubject, string EmailBody, List<string> lstattachment = null)
        {

           
            var key = sendgridkey;
            var client = new SendGridClient(key);

            var from = new EmailAddress(EmailFrom, "");
            var subject = EmailSubject;

            var to = new EmailAddress(EmailTo, "");
            var plainTextContent = "";
            var htmlContent = EmailBody;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            msg.AddCc(EmailCc);
            // Create a Web transport, using API Key
            try
            {
                var response = await client.SendEmailAsync(msg);

            }
            catch (Exception ex)
            {
                string str = ex.Message;

                throw ex;
            }

        }
        public static string mailBody(string template, Dictionary<string, string> parameter)
        {
            try
            {
                StringBuilder sb;

                string path = template;
                try
                {
                    System.IO.StreamReader sr = new System.IO.StreamReader(Path.Combine(Directory.GetCurrentDirectory(),template));
                    sb = new StringBuilder(sr.ReadToEnd());
                    sr.Close();
                }
                catch (Exception ex)
                {
                    //     LOGGING.Logger.Error(ex, t);
                    sb = new StringBuilder(string.Empty);
                }

                string msg = sb.ToString();

                foreach (var item in parameter)
                {
                    msg = msg.Replace(item.Key, item.Value);
                }

                return msg;
            }
            catch (Exception ex)
            {
                // LOGGING.Logger.Error(ex, t);
                return "";
            }
        }
        public async Task  SendSMS(string accountsid,string authtoken,string twiliophone,string text,string phonenumber)
        {
           
            try
            {
                CommonFunction commonFunction = new CommonFunction();
                var accountSid = accountsid;
                var authToken = authtoken;

                //var twilioPhone = new PhoneNumber(twiliophone);
                //var number = commonFunction.PhoneNumber(phonenumber);
                //if (number.Length == 10)
                //{
                //    var tonumber = "+1" + number;
                //    var to = new PhoneNumber(phonenumber);
                //    TwilioClient.Init(accountSid, authToken);

                //    var result = MessageResource.Create(to: to, from: twilioPhone,
                //        body: text);
                //}
               

            }
            catch (Exception ex)
            {
                string str = ex.Message;

                throw ex;
            }

        }

    }
}
