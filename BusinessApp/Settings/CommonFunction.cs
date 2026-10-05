using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
//using BusinessApp.Data;
using System.Drawing;

namespace BusinessApp.Settings
{
    public class CommonFunction
    {
        private readonly Random _random = new Random();

        // Generates a random number within a range.      
        public int RandomNumber(int min, int max)
        {
            return _random.Next(min, max);
        }
        public string RandomString(int size, bool lowerCase = false)
        {
            var builder = new StringBuilder(size);

            // Unicode/ASCII Letters are divided into two blocks
            // (Letters 65–90 / 97–122):
            // The first group containing the uppercase letters and
            // the second group containing the lowercase.  

            // char is a single Unicode character  
            char offset = lowerCase ? 'a' : 'A';
            const int lettersOffset = 26; // A...Z or a..z: length=26  

            for (var i = 0; i < size; i++)
            {
                var @char = (char)_random.Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }

            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

        public string RandomPassword()
        {
            var passwordBuilder = new StringBuilder();

            // 4-Letters lower case   
            passwordBuilder.Append(RandomString(2, true));

            // 4-Digits between 1000 and 9999  
            passwordBuilder.Append(RandomNumber(1000, 9999));

            // 2-Letters upper case  
            passwordBuilder.Append(RandomString(2));
            return passwordBuilder.ToString();
        }

        public string PhoneNumber(string phonenumber)
        {
            var number = phonenumber.Replace("+1", "");
            var replacenumber =  Regex.Replace(number, "[ ().-]+", "");
            return replacenumber.ToString();
        }
        //public static List<BioMarker> GetBioMarkers(string High, string Low, decimal imageWidth, decimal result, string type = "None")
        //{
        //    var Difference = Extensions.Number(High) - Extensions.Number(Low);
        //    List<BioMarker> bios = new List<BioMarker>();
        //    decimal originalImageWidth = imageWidth;

        //    if (Extensions.Number(Low) > 0)
        //    {
        //        if (Extensions.Number(High) > 0)
        //        {

        //            decimal Total = Extensions.Number(High) + Extensions.Number(Low);
        //            if (type == "Relative")
        //            {
        //                if (Total < result)
        //                {
        //                    //imageWidth = Convert.ToDecimal(Math.Pow(Convert.ToDouble(Total), 2) / (double)imageWidth); ;
        //                    imageWidth = Convert.ToDecimal((double)Total * (double)imageWidth / (double)result); ;
        //                }
        //            }
        //            decimal Diff = Extensions.Number(High) - Extensions.Number(Low);
        //            //if (Total < result)
        //            //    Total = result;
        //            if (imageWidth == 0)
        //                imageWidth = Total;

        //            BioMarker bStart = new BioMarker();
        //            bStart.Start = 0;
        //            bStart.End = Convert.ToDecimal(Extensions.Number(Low) * imageWidth / Total) - 0.01M;
        //            bStart.BrushColor = Color.Red;
        //            bios.Add(bStart);

        //            BioMarker b = new BioMarker();
        //            b.Start = bStart.End + 0.01M;// Convert.ToInt32(Extensions.Number(Low));
        //            b.End = Convert.ToDecimal(b.Start + (Diff * 25 * imageWidth / (Total * 100)));
        //            b.BrushColor = Color.Yellow;
        //            bios.Add(b);

        //            BioMarker b1 = new BioMarker();
        //            b1.Start = b.End + 0.01M;
        //            b1.End = Convert.ToDecimal((b.End + (Diff * 50 * imageWidth / (Total * 100))));
        //            b1.BrushColor = Color.Green;
        //            bios.Add(b1);

        //            BioMarker b2 = new BioMarker();
        //            b2.Start = b1.End;
        //            b2.End = Convert.ToDecimal((b1.End + (Diff * 25 * imageWidth / (Total * 100))));
        //            b2.BrushColor = Color.Yellow;
        //            bios.Add(b2);

        //            BioMarker bEnd = new BioMarker();
        //            bEnd.Start = b2.End + 0.01M;// Convert.ToInt32(Extensions.Number(High));
        //            bEnd.End = Convert.ToDecimal(originalImageWidth);
        //            bEnd.BrushColor = Color.Red;
        //            bios.Add(bEnd);
        //        }
        //        else
        //        {
        //            if (imageWidth == 0)
        //                imageWidth = Extensions.Number(Low) * 2;

        //            if (type == "Relative")
        //            {
        //                if ((Extensions.Number(Low) * 2) < result)
        //                {
        //                    // imageWidth = Convert.ToDecimal(Math.Pow(Convert.ToDouble(Extensions.Number(Low) * 2), 2) / (double)imageWidth);
        //                    imageWidth = Convert.ToDecimal((double)Convert.ToDouble(Extensions.Number(Low) * 2) * (double)imageWidth / (double)result); ;
        //                }
        //            }
        //            BioMarker bStart = new BioMarker();
        //            bStart.Start = 0;
        //            bStart.End = Convert.ToDecimal(50 * imageWidth / 100);
        //            //bStart.End = 99;
        //            bStart.BrushColor = Color.Red;
        //            bios.Add(bStart);


        //            BioMarker b1 = new BioMarker();
        //            b1.Start = bStart.End;
        //            b1.End = bStart.End + Convert.ToDecimal(25 * imageWidth / 100);
        //            //b1.End = 198;
        //            b1.BrushColor = Color.Yellow;
        //            bios.Add(b1);


        //            BioMarker b2 = new BioMarker();
        //            b2.Start = b1.End;
        //            b2.End = b1.End + Convert.ToDecimal(25 * imageWidth / 100);// Convert.ToDecimal(originalImageWidth);
        //            b2.BrushColor = Color.Green;
        //            bios.Add(b2);
        //        }
        //    }
        //    else
        //    {

        //        if (imageWidth == 0)
        //            imageWidth = Extensions.Number(High) * 2;

        //        if (type == "Relative")
        //        {
        //            if ((Extensions.Number(High) * 2) < result)
        //            {
        //                //imageWidth = Convert.ToDecimal(Math.Pow(Convert.ToDouble(Extensions.Number(High) * 2), 2) / (double)imageWidth); ;
        //                imageWidth = Convert.ToDecimal((double)Convert.ToDouble(Extensions.Number(High) * 2) * (double)imageWidth / (double)result); ;
        //            }
        //        }
        //        BioMarker bStart = new BioMarker();
        //        bStart.Start = 0;
        //        bStart.End = Convert.ToDecimal(25 * imageWidth / 100);
        //        //bStart.End = 100;
        //        bStart.BrushColor = Color.Green;
        //        bios.Add(bStart);


        //        BioMarker b1 = new BioMarker();
        //        b1.Start = bStart.End;
        //        b1.End = bStart.End + Convert.ToDecimal(25 * imageWidth / 100);
        //        //b1.End = 200;
        //        b1.BrushColor = Color.Yellow;
        //        bios.Add(b1);


        //        BioMarker b2 = new BioMarker();
        //        b2.Start = b1.End;
        //        b2.End = Convert.ToDecimal(originalImageWidth);
        //        b2.BrushColor = Color.Red;
        //        bios.Add(b2);

        //    }

        //    return bios;

        //}

        public static String HexConverter(int R,int G,int B)
        {
            return "#" + R.ToString("X2") + G.ToString("X2") + B.ToString("X2"); ;
        }
        public static bool ValidateFile(string path, string[] columns, ref List<string> missingColumns)
        {

            string[] fileColumns = System.IO.File.ReadLines(path).First().Split(',');
            string[] filevalue = new string[fileColumns.Length];
            string filedata;
            for (int i = 0; i < fileColumns.Length; i++)
            {
                filevalue[i] = fileColumns[i].Replace("\"", "");
                filedata = fileColumns[i].Replace("\"", "");

            }
            //string[] fileColumns= { "Site" , "Rx #" };
            missingColumns = columns.Except(filevalue).ToList();
            if (missingColumns.Count() == 0)
                for (int i = 0; i < columns.Length; i++)
                {
                    if (columns[i] != filevalue[i])
                        missingColumns.Add(columns[i]);
                }
            return (missingColumns.Count() == 0);
        }

    }
}
