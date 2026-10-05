using System.ComponentModel.DataAnnotations;

namespace BusinessApp.Models
{
    public class UserModel
    {
        public int UserId { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "Username/Email is not valid")]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required(ErrorMessage = "The Re-type Password field is required.")]
        [Compare("Password", ErrorMessage = "'Re-type Password' and 'Password' do not match.")]
        public string ReTypePassword { get; set; }

        public int UserType { get; set; }
        public string Pin { get; set; }
        public string Menu { get; set; }

        public bool Active { get; set; }

        public string IdentityID { get; set; }

    }
    public class UserModels
    {
        [Required]
        public string UserNames { get; set; }
        public string Emails { get; set; }
        [Required]
        public string NewPassword { get; set; }
        public string RetypePassword { get; set; }
        public string OldPassword { get; set; }
        public bool IsActive { get; set; }

    }

    public class ChangeUserName
    {
        [Required]
        public string IdentityID { get; set; }

        [Required]
        public string UserName { get; set; }
    }

    public class ChangePassword
    {
        [Required]
        public string IdentityID { get; set; }

        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string Password { get; set; }
    }
    public class ResetPassword
    {
        [Required]
        public string UserName { get; set; }
        public string Id { get; set; }
        public string Password { get; set; }
        public string RetypePassword { get; set; }
    }
}
