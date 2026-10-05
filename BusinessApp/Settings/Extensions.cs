using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;


namespace BusinessApp.Settings
{
    public class Extensions
    {
        public static decimal Number(object val)
        {
            return (val == null ? 0 : Convert.ToDecimal(val));
        }

    }
}
