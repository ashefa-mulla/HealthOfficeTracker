using System;

namespace BusinessApp.Models
{
    public class AttendanceReportItem
    {
        public int RowNo { get; set; }
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public int? WorkDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        public int HalfDays { get; set; }

        public string Day1 { get; set; }
        public string Day1_Bg { get; set; }
        public string Day1_Fg { get; set; }
        public string Day1_Weight { get; set; }

        public string Day2 { get; set; }
        public string Day2_Bg { get; set; }
        public string Day2_Fg { get; set; }
        public string Day2_Weight { get; set; }

        public string Day3 { get; set; }
        public string Day3_Bg { get; set; }
        public string Day3_Fg { get; set; }
        public string Day3_Weight { get; set; }

        public string Day4 { get; set; }
        public string Day4_Bg { get; set; }
        public string Day4_Fg { get; set; }
        public string Day4_Weight { get; set; }

        public string Day5 { get; set; }
        public string Day5_Bg { get; set; }
        public string Day5_Fg { get; set; }
        public string Day5_Weight { get; set; }

        public string Day6 { get; set; }
        public string Day6_Bg { get; set; }
        public string Day6_Fg { get; set; }
        public string Day6_Weight { get; set; }

        public string Day7 { get; set; }
        public string Day7_Bg { get; set; }
        public string Day7_Fg { get; set; }
        public string Day7_Weight { get; set; }

        public string Day8 { get; set; }
        public string Day8_Bg { get; set; }
        public string Day8_Fg { get; set; }
        public string Day8_Weight { get; set; }

        public string Day9 { get; set; }
        public string Day9_Bg { get; set; }
        public string Day9_Fg { get; set; }
        public string Day9_Weight { get; set; }

        public string Day10 { get; set; }
        public string Day10_Bg { get; set; }
        public string Day10_Fg { get; set; }
        public string Day10_Weight { get; set; }

        public string Day11 { get; set; }
        public string Day11_Bg { get; set; }
        public string Day11_Fg { get; set; }
        public string Day11_Weight { get; set; }

        public string Day12 { get; set; }
        public string Day12_Bg { get; set; }
        public string Day12_Fg { get; set; }
        public string Day12_Weight { get; set; }

        public string Day13 { get; set; }
        public string Day13_Bg { get; set; }
        public string Day13_Fg { get; set; }
        public string Day13_Weight { get; set; }

        public string Day14 { get; set; }
        public string Day14_Bg { get; set; }
        public string Day14_Fg { get; set; }
        public string Day14_Weight { get; set; }

        public string Day15 { get; set; }
        public string Day15_Bg { get; set; }
        public string Day15_Fg { get; set; }
        public string Day15_Weight { get; set; }

        public string Day16 { get; set; }
        public string Day16_Bg { get; set; }
        public string Day16_Fg { get; set; }
        public string Day16_Weight { get; set; }

        public string Day17 { get; set; }
        public string Day17_Bg { get; set; }
        public string Day17_Fg { get; set; }
        public string Day17_Weight { get; set; }

        public string Day18 { get; set; }
        public string Day18_Bg { get; set; }
        public string Day18_Fg { get; set; }
        public string Day18_Weight { get; set; }

        public string Day19 { get; set; }
        public string Day19_Bg { get; set; }
        public string Day19_Fg { get; set; }
        public string Day19_Weight { get; set; }

        public string Day20 { get; set; }
        public string Day20_Bg { get; set; }
        public string Day20_Fg { get; set; }
        public string Day20_Weight { get; set; }

        public string Day21 { get; set; }
        public string Day21_Bg { get; set; }
        public string Day21_Fg { get; set; }
        public string Day21_Weight { get; set; }

        public string Day22 { get; set; }
        public string Day22_Bg { get; set; }
        public string Day22_Fg { get; set; }
        public string Day22_Weight { get; set; }

        public string Day23 { get; set; }
        public string Day23_Bg { get; set; }
        public string Day23_Fg { get; set; }
        public string Day23_Weight { get; set; }

        public string Day24 { get; set; }
        public string Day24_Bg { get; set; }
        public string Day24_Fg { get; set; }
        public string Day24_Weight { get; set; }

        public string Day25 { get; set; }
        public string Day25_Bg { get; set; }
        public string Day25_Fg { get; set; }
        public string Day25_Weight { get; set; }

        public string Day26 { get; set; }
        public string Day26_Bg { get; set; }
        public string Day26_Fg { get; set; }
        public string Day26_Weight { get; set; }

        public string Day27 { get; set; }
        public string Day27_Bg { get; set; }
        public string Day27_Fg { get; set; }
        public string Day27_Weight { get; set; }

        public string Day28 { get; set; }
        public string Day28_Bg { get; set; }
        public string Day28_Fg { get; set; }
        public string Day28_Weight { get; set; }

        public string Day29 { get; set; }
        public string Day29_Bg { get; set; }
        public string Day29_Fg { get; set; }
        public string Day29_Weight { get; set; }

        public string Day30 { get; set; }
        public string Day30_Bg { get; set; }
        public string Day30_Fg { get; set; }
        public string Day30_Weight { get; set; }

        public string Day31 { get; set; }
        public string Day31_Bg { get; set; }
        public string Day31_Fg { get; set; }
        public string Day31_Weight { get; set; }

        public void SetDay(int day, string text, string bg, string fg, string weight)
        {
            switch (day)
            {
                case 1: Day1 = text; Day1_Bg = bg; Day1_Fg = fg; Day1_Weight = weight; break;
                case 2: Day2 = text; Day2_Bg = bg; Day2_Fg = fg; Day2_Weight = weight; break;
                case 3: Day3 = text; Day3_Bg = bg; Day3_Fg = fg; Day3_Weight = weight; break;
                case 4: Day4 = text; Day4_Bg = bg; Day4_Fg = fg; Day4_Weight = weight; break;
                case 5: Day5 = text; Day5_Bg = bg; Day5_Fg = fg; Day5_Weight = weight; break;
                case 6: Day6 = text; Day6_Bg = bg; Day6_Fg = fg; Day6_Weight = weight; break;
                case 7: Day7 = text; Day7_Bg = bg; Day7_Fg = fg; Day7_Weight = weight; break;
                case 8: Day8 = text; Day8_Bg = bg; Day8_Fg = fg; Day8_Weight = weight; break;
                case 9: Day9 = text; Day9_Bg = bg; Day9_Fg = fg; Day9_Weight = weight; break;
                case 10: Day10 = text; Day10_Bg = bg; Day10_Fg = fg; Day10_Weight = weight; break;
                case 11: Day11 = text; Day11_Bg = bg; Day11_Fg = fg; Day11_Weight = weight; break;
                case 12: Day12 = text; Day12_Bg = bg; Day12_Fg = fg; Day12_Weight = weight; break;
                case 13: Day13 = text; Day13_Bg = bg; Day13_Fg = fg; Day13_Weight = weight; break;
                case 14: Day14 = text; Day14_Bg = bg; Day14_Fg = fg; Day14_Weight = weight; break;
                case 15: Day15 = text; Day15_Bg = bg; Day15_Fg = fg; Day15_Weight = weight; break;
                case 16: Day16 = text; Day16_Bg = bg; Day16_Fg = fg; Day16_Weight = weight; break;
                case 17: Day17 = text; Day17_Bg = bg; Day17_Fg = fg; Day17_Weight = weight; break;
                case 18: Day18 = text; Day18_Bg = bg; Day18_Fg = fg; Day18_Weight = weight; break;
                case 19: Day19 = text; Day19_Bg = bg; Day19_Fg = fg; Day19_Weight = weight; break;
                case 20: Day20 = text; Day20_Bg = bg; Day20_Fg = fg; Day20_Weight = weight; break;
                case 21: Day21 = text; Day21_Bg = bg; Day21_Fg = fg; Day21_Weight = weight; break;
                case 22: Day22 = text; Day22_Bg = bg; Day22_Fg = fg; Day22_Weight = weight; break;
                case 23: Day23 = text; Day23_Bg = bg; Day23_Fg = fg; Day23_Weight = weight; break;
                case 24: Day24 = text; Day24_Bg = bg; Day24_Fg = fg; Day24_Weight = weight; break;
                case 25: Day25 = text; Day25_Bg = bg; Day25_Fg = fg; Day25_Weight = weight; break;
                case 26: Day26 = text; Day26_Bg = bg; Day26_Fg = fg; Day26_Weight = weight; break;
                case 27: Day27 = text; Day27_Bg = bg; Day27_Fg = fg; Day27_Weight = weight; break;
                case 28: Day28 = text; Day28_Bg = bg; Day28_Fg = fg; Day28_Weight = weight; break;
                case 29: Day29 = text; Day29_Bg = bg; Day29_Fg = fg; Day29_Weight = weight; break;
                case 30: Day30 = text; Day30_Bg = bg; Day30_Fg = fg; Day30_Weight = weight; break;
                case 31: Day31 = text; Day31_Bg = bg; Day31_Fg = fg; Day31_Weight = weight; break;
            }
        }
    }
}
