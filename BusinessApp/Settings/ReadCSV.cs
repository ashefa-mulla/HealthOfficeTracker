using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessApp.Settings
{
    public class ReadCSV: IDisposable
    {
        //public DataTable ImportCsvFile(string filename)
        //{
        //    FileInfo file = new FileInfo(filename);

        //    using (OleDbConnection con = new OleDbConnection("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\"" + file.DirectoryName + "\"; Extended Properties='text;HDR=Yes;FMT=Delimited(,)';"))
        //    {
        //        using (OleDbCommand cmd = new OleDbCommand(string.Format("SELECT * FROM [{0}]", file.Name), con))
        //        {
        //            con.Open();

        //            // Using a DataTable to process the data
        //            using (OleDbDataAdapter adp = new OleDbDataAdapter(cmd))
        //            {
        //                using (DataTable tbl = new DataTable("MyTable"))
        //                {
        //                    adp.Fill(tbl);
        //                    return tbl;
        //                }

        //            }
        //        }
        //    }
        //}

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            //~ReadCSV();
        }
    }
}
