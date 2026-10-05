using System;

namespace BusinessApp.Models
{
    public class Matrix4teamAnswerModel
    {
        public int Id { get; set; }             // Primary key (Identity column)
        public int QId { get; set; }           // Foreign key or reference ID for a question
        public string Answer { get; set; }      // The answer to the question
        public int UserId { get; set; }        // The ID of the user who provided the answer
        public DateTime UpdatedDate { get; set; } // Date when the answer was updated (string, assuming it's in a date format)
        public string CommentText { get; set; }
    }
}
