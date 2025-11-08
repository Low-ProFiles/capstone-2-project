
import type { SpotRes } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpotCardProps {
  spot: SpotRes;
}

const SpotCard = ({ spot }: SpotCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{spot.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">Order: {spot.orderNo}</p>
        {spot.description && <p className="text-sm text-gray-800">{spot.description}</p>}
        {spot.lat && spot.lng && (
          <p className="text-xs text-gray-500 mt-2">
            Location: {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotCard;
