/**
 * ActionTiles Component
 *
 * Displays action items requiring user attention in tile format.
 * Each tile shows an icon, count, and description.
 */

'use client';

import { TaskIcon, AppointmentIcon, ReportIcon } from '@/components/icons';

interface ActionTile {
  id: string;
  type: 'task' | 'appointment' | 'report';
  count: number;
  label: string;
}

interface ActionTilesProps {
  tiles?: ActionTile[];
  className?: string;
  onTileClick?: (tile: ActionTile) => void;
}

const DEFAULT_TILES: ActionTile[] = [
  { id: '1', type: 'task', count: 2, label: 'tasks due today' },
  { id: '2', type: 'appointment', count: 8, label: 'appointments today' },
  { id: '3', type: 'report', count: 4, label: 'reports scheduled for today' },
];

export function ActionTiles({ tiles = DEFAULT_TILES, className = '', onTileClick }: ActionTilesProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {tiles.map((tile) => (
        <ActionTile key={tile.id} tile={tile} onClick={onTileClick} />
      ))}
    </div>
  );
}

interface ActionTileProps {
  tile: ActionTile;
  onClick?: (tile: ActionTile) => void;
}

function ActionTile({ tile, onClick }: ActionTileProps) {
  const Icon = tile.type === 'task' ? TaskIcon : tile.type === 'appointment' ? AppointmentIcon : ReportIcon;

  const handleClick = () => {
    if (onClick) {
      onClick(tile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2.5 px-4 py-3.5 bg-accent1-contrast border border-accent1-light rounded-lg cursor-pointer hover:bg-accent1-light transition-colors duration-200"
      style={{ boxSizing: 'border-box' }}
    >
      <Icon size={20} className="text-accent1-main flex-shrink-0" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold text-accent1-main">{tile.count}</span>
        <span className="text-sm text-accent1-main font-normal">{tile.label}</span>
      </div>
    </div>
  );
}
