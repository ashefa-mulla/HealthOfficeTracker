using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace BusinessApp.Utilities
{
    /// <summary>
    /// Safely extracts client IP address from HTTP request.
    /// Trusts X-Forwarded-For header only from known trusted proxies.
    /// </summary>
    public static class IpAddressHelper
    {
        private static readonly HashSet<string> TrustedProxies = new()
        {
            "127.0.0.1",
            "::1"
        };

        /// <summary>
        /// Extracts the client's real IP address, safely handling X-Forwarded-For header.
        /// </summary>
        public static string GetClientIpAddress(HttpContext httpContext)
        {
            if (httpContext == null) return "unknown";

            try
            {
                var remoteIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty;

                // If request comes from a trusted proxy, use X-Forwarded-For
                if (IsTrustedProxy(remoteIp) &&
                    httpContext.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
                {
                    var ips = forwardedFor.ToString().Split(',');
                    if (ips.Length > 0 && IPAddress.TryParse(ips[0].Trim(), out _))
                    {
                        return ips[0].Trim();
                    }
                }

                // Fallback to direct connection IP
                return httpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "unknown";
            }
            catch
            {
                return "unknown";
            }
        }

        private static bool IsTrustedProxy(string ipAddress)
        {
            if (string.IsNullOrEmpty(ipAddress))
                return false;

            return TrustedProxies.Contains(ipAddress);
        }

        public static void AddTrustedProxy(string ipAddress)
        {
            if (!string.IsNullOrEmpty(ipAddress))
            {
                TrustedProxies.Add(ipAddress);
            }
        }

        public static string GenerateDeviceFingerprint(HttpContext httpContext)
        {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
            var ipAddress = GetClientIpAddress(httpContext);
            return $"{userAgent}:{ipAddress}";
        }

        public static string Hash(string rawDeviceId)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawDeviceId));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }
    }
}
