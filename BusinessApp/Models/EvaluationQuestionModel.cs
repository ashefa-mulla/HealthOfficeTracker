using System;

namespace BusinessApp.Models
{
    public class EvaluationQuestionModel
    {

        public int Id { get; set; }                 // 0 = new record
        public int EmployeeId { get; set; }         // Employee who owns this question
        public string QuestionText { get; set; }    // The evaluation question
        public bool IsActive { get; set; }          // True = visible/active
        public DateOnly? CreatedAt { get; set; }       // Optional, string for UI formatting
        public DateTime? DeactivatedAt { get; set; }


    }
}
