using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace BusinessApp.Utilities
{
    public static class ExcelAttendanceReader
    {
        public static List<Dictionary<string, string>> ReadExcelOrCsv(Stream stream, string fileName)
        {
            string ext = Path.GetExtension(fileName)?.ToLowerInvariant();

            if (ext == ".csv")
            {
                return ReadCsv(stream);
            }
            else
            {
                // Handles .xlsx / OpenXML zip packages
                return ReadXlsx(stream);
            }
        }

        public static List<Dictionary<string, string>> ReadXlsx(Stream stream)
        {
            var rows = new List<Dictionary<string, string>>();

            using var archive = new ZipArchive(stream, ZipArchiveMode.Read, leaveOpen: true);

            // 1. Read shared strings
            var sharedStrings = new List<string>();
            var sstEntry = archive.GetEntry("xl/sharedStrings.xml");
            if (sstEntry != null)
            {
                using var sstStream = sstEntry.Open();
                var sstDoc = XDocument.Load(sstStream);
                foreach (var si in sstDoc.Descendants().Where(e => e.Name.LocalName == "si"))
                {
                    var text = string.Concat(si.Descendants().Where(e => e.Name.LocalName == "t").Select(t => t.Value));
                    sharedStrings.Add(text);
                }
            }

            // 2. Find first worksheet
            var sheetEntry = archive.GetEntry("xl/worksheets/sheet1.xml")
                ?? archive.Entries.FirstOrDefault(e => e.FullName.StartsWith("xl/worksheets/sheet", StringComparison.OrdinalIgnoreCase) && e.FullName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase));

            if (sheetEntry == null)
            {
                return rows;
            }

            using var sheetStream = sheetEntry.Open();
            var sheetDoc = XDocument.Load(sheetStream);

            var sheetData = sheetDoc.Descendants().FirstOrDefault(e => e.Name.LocalName == "sheetData");
            if (sheetData == null)
            {
                return rows;
            }

            var allRows = sheetData.Elements().Where(e => e.Name.LocalName == "row").ToList();
            if (allRows.Count < 2)
            {
                return rows;
            }

            // 3. Read Header Row (first row)
            var headers = new Dictionary<int, string>();
            int headerColIndex = 0;
            foreach (var c in allRows[0].Elements().Where(e => e.Name.LocalName == "c"))
            {
                string rAttr = c.Attribute("r")?.Value;
                int col = !string.IsNullOrEmpty(rAttr) ? GetColumnIndex(rAttr) : headerColIndex++;
                string val = GetCellValue(c, sharedStrings);
                if (!string.IsNullOrWhiteSpace(val))
                {
                    headers[col] = val.Trim();
                }
            }

            // 4. Read Data Rows
            for (int i = 1; i < allRows.Count; i++)
            {
                var rowElement = allRows[i];
                var rowDict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                int dataColIndex = 0;

                foreach (var c in rowElement.Elements().Where(e => e.Name.LocalName == "c"))
                {
                    string rAttr = c.Attribute("r")?.Value;
                    int col = !string.IsNullOrEmpty(rAttr) ? GetColumnIndex(rAttr) : dataColIndex++;
                    if (headers.TryGetValue(col, out var headerName))
                    {
                        string val = GetCellValue(c, sharedStrings);
                        rowDict[headerName] = val?.Trim() ?? string.Empty;
                    }
                }

                if (rowDict.Count > 0 && rowDict.Values.Any(v => !string.IsNullOrWhiteSpace(v)))
                {
                    rows.Add(rowDict);
                }
            }

            return rows;
        }

        public static List<Dictionary<string, string>> ReadCsv(Stream stream)
        {
            var rows = new List<Dictionary<string, string>>();
            using var reader = new StreamReader(stream, Encoding.UTF8, true, leaveOpen: true);

            string headerLine = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(headerLine))
            {
                return rows;
            }

            char delimiter = headerLine.Contains('\t') ? '\t' : (headerLine.Contains(';') ? ';' : ',');
            var headers = ParseCsvLine(headerLine, delimiter);

            string line;
            while ((line = reader.ReadLine()) != null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;

                var cols = ParseCsvLine(line, delimiter);
                var rowDict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                for (int i = 0; i < headers.Count && i < cols.Count; i++)
                {
                    rowDict[headers[i]] = cols[i]?.Trim() ?? string.Empty;
                }

                if (rowDict.Values.Any(v => !string.IsNullOrWhiteSpace(v)))
                {
                    rows.Add(rowDict);
                }
            }

            return rows;
        }

        private static List<string> ParseCsvLine(string line, char delimiter)
        {
            var result = new List<string>();
            bool inQuotes = false;
            var current = new StringBuilder();

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];
                if (c == '"')
                {
                    if (inQuotes && i + 1 < line.Length && line[i + 1] == '"')
                    {
                        current.Append('"');
                        i++;
                    }
                    else
                    {
                        inQuotes = !inQuotes;
                    }
                }
                else if (c == delimiter && !inQuotes)
                {
                    result.Add(current.ToString().Trim());
                    current.Clear();
                }
                else
                {
                    current.Append(c);
                }
            }
            result.Add(current.ToString().Trim());
            return result;
        }

        private static int GetColumnIndex(string cellRef)
        {
            if (string.IsNullOrEmpty(cellRef)) return -1;
            int col = 0;
            foreach (char ch in cellRef)
            {
                if (char.IsLetter(ch))
                {
                    col = col * 26 + (char.ToUpperInvariant(ch) - 'A' + 1);
                }
                else
                {
                    break;
                }
            }
            return col - 1; // 0-based index
        }

        private static string GetCellValue(XElement c, List<string> sharedStrings)
        {
            string t = c.Attribute("t")?.Value;
            if (t == "s") // shared string index
            {
                var v = c.Elements().FirstOrDefault(e => e.Name.LocalName == "v")?.Value;
                if (int.TryParse(v, out int idx) && idx >= 0 && idx < sharedStrings.Count)
                {
                    return sharedStrings[idx];
                }
                return string.Empty;
            }
            else if (t == "inlineStr")
            {
                var isElem = c.Elements().FirstOrDefault(e => e.Name.LocalName == "is");
                if (isElem != null)
                {
                    return string.Concat(isElem.Descendants().Where(e => e.Name.LocalName == "t").Select(tElem => tElem.Value));
                }
                return string.Empty;
            }
            else
            {
                return c.Elements().FirstOrDefault(e => e.Name.LocalName == "v")?.Value ?? string.Empty;
            }
        }
    }
}

