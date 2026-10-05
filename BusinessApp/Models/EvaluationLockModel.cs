using System;

namespace BusinessApp.Models
{
    public class EvaluationLockModel
    {
        public int Id { get; set; }               // 0 = new record
        public int EmployeeId { get; set; }       // Employee for whom the evaluation is locked
        public int EvalYear { get; set; }         // Year of the lock
        public int EvalMonth { get; set; }        // Month of the lock
        public bool IsLocked { get; set; }        // True = locked, False = unlocked
        public DateTime? LockedAt { get; set; }   // When was it locked
        public int? LockedBy { get; set; }        // Admin user who locked/unlocked

    }
}
