﻿namespace NepSolve.Models.DTOs.Cluster
{
    public class ClusterResponseDTO
    {
        public string Id { get; set; }
        public string Topic { get; set; }
        public string ClusterSummary { get; set; }
        public List<string> Posts { get; set; } = new List<string>();
        public List<string> Regions { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
        public List<string> Labels { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
