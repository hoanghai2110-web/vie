import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@shared/schema';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardTableProps {
  users: User[];
  title?: string;
  showPoints?: boolean;
}

export function LeaderboardTable({ users, title = "Top Contributors", showPoints = true }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return (
          <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => {
            const rank = index + 1;
            return (
              <div
                key={user.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors hover:bg-slate-50 ${
                  rank <= 3 ? 'bg-gradient-to-r from-slate-50 to-white' : 'bg-white'
                }`}
              >
                <Badge className={`${getRankBadgeColor(rank)} flex items-center space-x-1 px-2 py-1`}>
                  {rank <= 3 ? getRankIcon(rank) : <span className="font-bold">#{rank}</span>}
                </Badge>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || ''} alt={user.fullName || user.username} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                    {(user.fullName || user.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">
                    {user.fullName || user.username}
                  </h4>
                  <p className="text-slate-500 text-sm truncate">
                    {user.bio || user.email}
                  </p>
                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {showPoints && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800">
                      {user.points?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-slate-500">điểm</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
