import { CollisionDetection, UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { closestCorners, getFirstCollision } from '@dnd-kit/core';
import { useState, useCallback, useRef } from 'react';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
  
    return (
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-4 rounded-lg ${isOver ? 'bg-blue-100' : ''}`}
        style={{ minHeight: '200px' }}
      >
        {children}
      </div>
    );
  };

export const isColumnId = (id: UniqueIdentifier): boolean => {
    return typeof id === 'string' && id.startsWith('column-');
  };
  
export const customCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = closestCorners(args);
  
    if (pointerCollisions.length > 0) {
      const firstCollision = pointerCollisions[0];
      if (firstCollision && isColumnId(firstCollision.id)) {
        return [firstCollision];
      }
      const columnCollisions = pointerCollisions.filter(collision => 
        isColumnId(collision.id)
      );
      if (columnCollisions.length > 0) {
        return [firstCollision, ...columnCollisions];
      }
    }
  
    return pointerCollisions;
  };

export const useMouseInteraction = (clickThreshold = 200, dragThreshold = 5) => {
  const [interactionType, setInteractionType] = useState<'none' | 'clicking' | 'dragging'>('none');
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setInteractionType('clicking');
    
    timeoutRef.current = setTimeout(() => {
      setInteractionType('dragging');
    }, clickThreshold);
  }, [clickThreshold]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (interactionType === 'clicking' && startPosRef.current) {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setInteractionType('dragging');
      }
    }
  }, [interactionType, dragThreshold]);

  const handleMouseUp = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (interactionType === 'clicking') {
      // Trigger click action here or set a state to indicate a click occurred
    }
    setInteractionType('none');
    startPosRef.current = null;
  }, [interactionType]);

  return {
    interactionType,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    }
  };
};