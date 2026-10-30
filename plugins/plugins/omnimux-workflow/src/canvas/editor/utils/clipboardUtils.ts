/**
 * Ported (narrowed) from Gxgen
 * `apps/web/src/pages/CanvasEditor/utils/clipboardUtils.ts`.
 *
 * In-island clipboard (a ref, not the system clipboard): copy keeps the
 * selected nodes plus the edges between them; paste clones with fresh ids
 * and a configurable offset. Used by the keyboard shortcut base set and
 * the context menu (M2).
 */

import { type Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasNode } from './canvasInputMutationGateway';

export interface ClipboardData {
  nodes: CanvasNode[];
  edges: Edge[];
}

export interface PasteResult {
  nodes: CanvasNode[];
  edges: Edge[];
  newPastePosition: { x: number; y: number };
}

/**
 * Build clipboard data from the currently selected nodes.
 * @param nodes all nodes
 * @param edges all edges
 * @returns clipboard data (selected nodes + edges between them only)
 */
export function copyNodesToClipboard(nodes: CanvasNode[], edges: Edge[]): ClipboardData {
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
  const connectedEdges = edges.filter(
    (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target),
  );

  return {
    nodes: selectedNodes,
    edges: connectedEdges,
  };
}

/** Bounding-box center of a node group (paste anchor). */
function calculateBoundingBoxCenter(nodes: CanvasNode[]): { x: number; y: number } {
  const minX = Math.min(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  const maxX = Math.max(...nodes.map((n) => n.position.x));
  const maxY = Math.max(...nodes.map((n) => n.position.y));
  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  };
}

/**
 * Clone clipboard nodes at a target position (or offset from origin).
 * @param clipboard clipboard data
 * @param targetPosition explicit paste position (context menu / drop point)
 * @param lastPastePosition previous paste anchor (sequential paste offsets)
 */
export function pasteFromClipboard(
  clipboard: ClipboardData,
  targetPosition?: { x: number; y: number },
  lastPastePosition?: { x: number; y: number } | null,
): PasteResult | null {
  const { nodes: copiedNodes, edges: copiedEdges } = clipboard;
  if (copiedNodes.length === 0) {
    return null;
  }

  const center = calculateBoundingBoxCenter(copiedNodes);

  let pasteX: number;
  let pasteY: number;
  if (targetPosition) {
    pasteX = targetPosition.x;
    pasteY = targetPosition.y;
  } else {
    // Offset from the last paste (cascade) or from the original position.
    const offset = lastPastePosition ? 50 : 30;
    pasteX = center.x + offset;
    pasteY = center.y + offset;
  }

  const idMapping = new Map<string, string>();
  const newNodes = copiedNodes.map((node) => {
    const newId = uuidv4();
    idMapping.set(node.id, newId);
    return {
      ...node,
      id: newId,
      position: {
        x: pasteX + (node.position.x - center.x),
        y: pasteY + (node.position.y - center.y),
      },
      selected: true,
    } as CanvasNode;
  });

  const newEdges = copiedEdges.map((edge) => ({
    ...edge,
    id: uuidv4(),
    source: idMapping.get(edge.source) || edge.source,
    target: idMapping.get(edge.target) || edge.target,
    selected: false,
  }));

  return {
    nodes: newNodes,
    edges: newEdges,
    newPastePosition: { x: pasteX, y: pasteY },
  };
}
