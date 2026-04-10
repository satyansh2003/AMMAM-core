package com.ammam.service;

import com.ammam.model.AnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class MemoryAnalysisService {

    /**
     * Simulates the "Island Protocol" - processing a memory dump via Spatial Entropy Mapping.
     * The seed is derived from the uploaded file so results are unique per file but reproducible.
     */
    public List<AnalysisResponse.MemoryBlock> performEntropyMapping(byte[] rawMemoryDump, long seed) {
        Random random = new Random(seed);

        // Grid dimension for frontend heatmap visualization
        int gridWidth = 40;
        int gridHeight = 25;
        int totalBlocks = gridWidth * gridHeight;

        List<AnalysisResponse.MemoryBlock> memoryGrid = new ArrayList<>();

        // Generate baseline entropy grid
        for (int i = 0; i < totalBlocks; i++) {
            int x = i % gridWidth;
            int y = i / gridWidth;
            
            // Baseline entropy is usually low for empty/structured data
            double baseEntropy = 0.1 + (random.nextDouble() * 0.3); // 0.1 to 0.4
            
            memoryGrid.add(AnalysisResponse.MemoryBlock.builder()
                    .id(i)
                    .x(x)
                    .y(y)
                    .entropy(baseEntropy)
                    .isSuspicious(false)
                    .islandId(0)
                    .build());
        }

        // Dynamically inject 2 to 4 malware islands based on the seed
        int numIslands = 2 + random.nextInt(3);
        for(int id = 1; id <= numIslands; id++) {
            int centerX = 5 + random.nextInt(gridWidth - 10);
            int centerY = 5 + random.nextInt(gridHeight - 10);
            double peakEntropy = 0.82 + (random.nextDouble() * 0.15); // 0.82 to 0.97
            injectMalwareIsland(memoryGrid, gridWidth, centerX, centerY, id, peakEntropy, random);
        }

        return memoryGrid;
    }

    private void injectMalwareIsland(List<AnalysisResponse.MemoryBlock> grid, int width, int centerX, int centerY, int islandId, double peakEntropy, Random random) {
        int radius = 2 + random.nextInt(3); // 2 to 4 block radius
        
        for (AnalysisResponse.MemoryBlock block : grid) {
            double distance = Math.sqrt(Math.pow(block.getX() - centerX, 2) + Math.pow(block.getY() - centerY, 2));
            if (distance <= radius) {
                // High entropy for malware blocks
                double noise = (random.nextDouble() * 0.1) - 0.05;
                double adjustedEntropy = Math.min(0.99, Math.max(0.7, peakEntropy - (distance * 0.05) + noise));
                
                block.setEntropy(adjustedEntropy);
                block.setSuspicious(adjustedEntropy > 0.75);
                block.setIslandId(islandId);
            }
        }
    }
}
