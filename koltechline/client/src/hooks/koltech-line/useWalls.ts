import { useState, useEffect } from 'react';
import { Wall } from '../../types/koltech-line';
import { wallApi } from '../../utils/api';
import { getCategoryIcon, getCategoryColor } from '../../utils/koltech-line/wallHelpers';

interface UseWallsProps {
  userId?: string;
  selectedCategory?: string;
}

export const useWalls = ({ userId, selectedCategory = 'all' }: UseWallsProps = {}) => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [allWalls, setAllWalls] = useState<Wall[]>([]);
  const [loadingWalls, setLoadingWalls] = useState(true);

  const loadWalls = async (category: string = 'all') => {
    setLoadingWalls(true);
    try {
      const response = await wallApi.getWalls({
        category: category !== 'all' ? category : undefined,
        limit: 50
      });
      
      const wallsData = response.data.walls.map((wall: any) => ({
        id: wall._id,
        name: wall.name,
        description: wall.description,
        icon: getCategoryIcon(wall.category),
        color: getCategoryColor(wall.category),
        participants: wall.memberCount,
        category: wall.category,
        isActive: true,
        isMember: userId ? wall.members?.includes(userId) : false,
        isAdmin: userId ? wall.admins?.includes(userId) : false,
        requiresApproval: wall.settings?.requireApproval || false
      }));
      
      setWalls(wallsData);
      
      // Update allWalls cache
      if (category === 'all') {
        setAllWalls(wallsData);
      } else {
        // Add new walls to cache without removing old ones
        setAllWalls(prev => {
          const newWalls = wallsData.filter((w: Wall) => !prev.find(p => p.id === w.id));
          return [...prev, ...newWalls];
        });
      }
    } catch (error) {
      console.error('Error loading walls:', error);
    } finally {
      setLoadingWalls(false);
    }
  };

  const loadSingleWall = async (wallId: string) => {
    try {
      const response = await wallApi.getWalls({ limit: 50 });
      const allWallsData = response.data.walls.map((wall: any) => ({
        id: wall._id,
        name: wall.name,
        description: wall.description,
        icon: getCategoryIcon(wall.category),
        color: getCategoryColor(wall.category),
        participants: wall.memberCount,
        category: wall.category,
        isActive: true,
        isMember: userId ? wall.members?.includes(userId) : false,
        isAdmin: userId ? wall.admins?.includes(userId) : false,
        requiresApproval: wall.settings?.requireApproval || false
      }));
      
      setAllWalls(allWallsData);
    } catch (error) {
      console.error('Error loading single wall:', error);
    }
  };

  const updateWallMembership = (wallId: string, isMember: boolean, participantsDelta: number = 0) => {
    const updateWall = (wall: Wall) => 
      wall.id === wallId
        ? { ...wall, isMember, participants: wall.participants + participantsDelta }
        : wall;

    setWalls(prev => prev.map(updateWall));
    setAllWalls(prev => prev.map(updateWall));
  };

  const joinWall = (wallId: string) => {
    updateWallMembership(wallId, true, 1);
  };

  const leaveWall = (wallId: string) => {
    updateWallMembership(wallId, false, -1);
  };

  const addWall = (wall: Wall) => {
    setWalls(prev => [...prev, wall]);
    setAllWalls(prev => [...prev, wall]);
  };

  useEffect(() => {
    if (selectedCategory) {
      loadWalls(selectedCategory);
    }
  }, [selectedCategory]);

  return {
    walls,
    allWalls,
    loadingWalls,
    loadWalls,
    loadSingleWall,
    joinWall,
    leaveWall,
    addWall,
    setWalls,
    setAllWalls
  };
};
