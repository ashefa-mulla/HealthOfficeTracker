using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace BusinessApp.Models
{
    public class PunchDetailTodo
    {
        public int ID { get; set; }
        public int EmployeeID { get; set; }
        public Nullable<System.DateTime> ShiftDt { get; set; }
        //[AllowHtml]
        [UIHint("tinymce_full")]
        public string ToDoDetail { get; set; }
        public Nullable<bool> EmailSent { get; set; }
    }
}
