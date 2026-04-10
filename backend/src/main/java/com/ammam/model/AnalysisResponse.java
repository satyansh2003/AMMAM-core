package com.ammam.model;

import java.util.List;

public class AnalysisResponse {
    private String status;
    private double processingTimeMs;
    private List<MemoryBlock> gridData;
    private List<ExtractedPayload> payloads;
    private ComparativeStats stats;

    public AnalysisResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(double processingTimeMs) { this.processingTimeMs = processingTimeMs; }
    public List<MemoryBlock> getGridData() { return gridData; }
    public void setGridData(List<MemoryBlock> gridData) { this.gridData = gridData; }
    public List<ExtractedPayload> getPayloads() { return payloads; }
    public void setPayloads(List<ExtractedPayload> payloads) { this.payloads = payloads; }
    public ComparativeStats getStats() { return stats; }
    public void setStats(ComparativeStats stats) { this.stats = stats; }

    public static class Builder {
        private AnalysisResponse instance = new AnalysisResponse();
        public Builder status(String s) { instance.status = s; return this; }
        public Builder processingTimeMs(double p) { instance.processingTimeMs = p; return this; }
        public Builder gridData(List<MemoryBlock> g) { instance.gridData = g; return this; }
        public Builder payloads(List<ExtractedPayload> p) { instance.payloads = p; return this; }
        public Builder stats(ComparativeStats s) { instance.stats = s; return this; }
        public AnalysisResponse build() { return instance; }
    }
    public static Builder builder() { return new Builder(); }

    public static class MemoryBlock {
        private int id;
        private int x;
        private int y;
        private double entropy;
        private boolean isSuspicious;
        private int islandId;

        public MemoryBlock() {}
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public int getX() { return x; }
        public void setX(int x) { this.x = x; }
        public int getY() { return y; }
        public void setY(int y) { this.y = y; }
        public double getEntropy() { return entropy; }
        public void setEntropy(double entropy) { this.entropy = entropy; }
        public boolean isSuspicious() { return isSuspicious; }
        public void setSuspicious(boolean isSuspicious) { this.isSuspicious = isSuspicious; }
        public int getIslandId() { return islandId; }
        public void setIslandId(int islandId) { this.islandId = islandId; }

        public static class Builder {
            private MemoryBlock instance = new MemoryBlock();
            public Builder id(int i) { instance.id = i; return this; }
            public Builder x(int x) { instance.x = x; return this; }
            public Builder y(int y) { instance.y = y; return this; }
            public Builder entropy(double e) { instance.entropy = e; return this; }
            public Builder isSuspicious(boolean s) { instance.isSuspicious = s; return this; }
            public Builder islandId(int i) { instance.islandId = i; return this; }
            public MemoryBlock build() { return instance; }
        }
        public static Builder builder() { return new Builder(); }
    }

    public static class ExtractedPayload {
        private String id;
        private String content;
        private String type;
        private double confidence;

        public ExtractedPayload() {}
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }

        public static class Builder {
            private ExtractedPayload instance = new ExtractedPayload();
            public Builder id(String i) { instance.id = i; return this; }
            public Builder content(String c) { instance.content = c; return this; }
            public Builder type(String t) { instance.type = t; return this; }
            public Builder confidence(double c) { instance.confidence = c; return this; }
            public ExtractedPayload build() { return instance; }
        }
        public static Builder builder() { return new Builder(); }
    }

    public static class ComparativeStats {
        private double ammamDetectionRate;
        private double traditionalDetectionRate;
        private double payloadExtractionRate;
        private double traditionalExtractionRate;

        public ComparativeStats() {}
        public double getAmmamDetectionRate() { return ammamDetectionRate; }
        public void setAmmamDetectionRate(double ammamDetectionRate) { this.ammamDetectionRate = ammamDetectionRate; }
        public double getTraditionalDetectionRate() { return traditionalDetectionRate; }
        public void setTraditionalDetectionRate(double traditionalDetectionRate) { this.traditionalDetectionRate = traditionalDetectionRate; }
        public double getPayloadExtractionRate() { return payloadExtractionRate; }
        public void setPayloadExtractionRate(double payloadExtractionRate) { this.payloadExtractionRate = payloadExtractionRate; }
        public double getTraditionalExtractionRate() { return traditionalExtractionRate; }
        public void setTraditionalExtractionRate(double traditionalExtractionRate) { this.traditionalExtractionRate = traditionalExtractionRate; }

        public static class Builder {
            private ComparativeStats instance = new ComparativeStats();
            public Builder ammamDetectionRate(double r) { instance.ammamDetectionRate = r; return this; }
            public Builder traditionalDetectionRate(double r) { instance.traditionalDetectionRate = r; return this; }
            public Builder payloadExtractionRate(double r) { instance.payloadExtractionRate = r; return this; }
            public Builder traditionalExtractionRate(double r) { instance.traditionalExtractionRate = r; return this; }
            public ComparativeStats build() { return instance; }
        }
        public static Builder builder() { return new Builder(); }
    }
}
