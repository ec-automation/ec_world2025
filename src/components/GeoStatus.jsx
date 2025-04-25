'use client';

import { Globe, ShieldAlert } from 'lucide-react';

export default function GeoStatus({ info }) {
  if (!info) return null;

  const { reserved, country, city } = info;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {reserved ? (
        <>
          <ShieldAlert size={16} className="text-yellow-400" />
          <span>Red Privada (CGNAT)</span>
        </>
      ) : (
        <>
          <Globe size={16} className="text-green-400" />
          <span>{city}, {country}</span>
        </>
      )}
    </div>
  );
}
