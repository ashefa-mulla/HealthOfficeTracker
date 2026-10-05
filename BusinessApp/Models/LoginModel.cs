using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace BusinessApp.Models
{
    public class LoginModel
    {
        [Required]
        [Display(Name = "User Name")]
        [MaxLength(100)]
        public string Email { get; set; }


        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
    public class UserTimezoneModel
    {
        public int UserId { get; set; }
        public int UserType { get; set; }
        public string  Timezone { get; set; }
    }
}
