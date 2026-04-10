import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const NetworkNodeGraph = ({ gridData, width = 800, height = 500 }) => {
  const fgRef = useRef();

  const graphData = useMemo(() => {
    // Filter only suspicious nodes or fragments to show in the graph
    const suspiciousBlocks = gridData.filter(b => b.isSuspicious || b.islandId > 0);
    
    const nodes = suspiciousBlocks.map(block => ({
      id: `0x${block.id.toString(16).padStart(4, '0').toUpperCase()}`,
      islandId: block.islandId,
      entropy: block.entropy,
      val: Math.max(1, block.entropy)
    }));

    const links = [];
    // Simulate links between nodes in the same island
    const islands = {};
    nodes.forEach(n => {
      if (n.islandId > 0) {
        if (!islands[n.islandId]) islands[n.islandId] = [];
        islands[n.islandId].push(n);
      }
    });

    Object.values(islands).forEach(islandNodes => {
      for (let i = 0; i < islandNodes.length; i++) {
        // Connect each node to max 2 others in the same island to form a sparse graph
        for (let j = 1; j <= 2; j++) {
            if (i + j < islandNodes.length) {
                links.push({
                    source: islandNodes[i].id,
                    target: islandNodes[i+j].id
                });
            }
        }
      }
    });

    return { nodes, links };
  }, [gridData]);

  const getNodeColor = (node) => {
    if (node.islandId === 1) return '#ff3366'; // Red
    if (node.islandId === 2) return '#00f0ff'; // Cyan
    if (node.islandId > 2) return '#ffbb00'; // Amber
    return '#00ff6a'; // Green
  };

  useEffect(() => {
      // Adjust physics engine for small clustering
      if (fgRef.current) {
          fgRef.current.d3Force('charge').strength(-300); // Stronger repulsion so small graphs don't clump
          fgRef.current.d3Force('link').distance(50); // Make links longer
      }
  }, [graphData]);

  if (!graphData.nodes.length) {
      return (
          <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
              No clustered anomalies detected.
          </div>
      );
  }

  return (
    <div style={{ border: '1px solid var(--panel-border)', borderRadius: '4px', overflow: 'hidden', background: 'transparent', width, height }}>
      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={height}
        graphData={graphData}
        nodeColor={getNodeColor}
        nodeRelSize={8}
        linkColor={() => 'rgba(0, 255, 106, 0.3)'}
        linkWidth={2}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 10 / globalScale;
          ctx.font = `${fontSize}px var(--font-mono)`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(label, node.x, node.y + 6);
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
};

export default NetworkNodeGraph;
