import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Medal, 
  Crown, 
  Star,
  Target,
  Award
} from 'lucide-react';
import type { User, Competition } from '@shared/schema';

export default function Leaderboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overall');

  const { data: topUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users/leaderboard'],
  });

  const { data: competitions, isLoading: competitionsLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions'],
  });

  const ongoingCompetitions = competitions?.filter(c => c.status === 'ongoing') || [];
  const completedCompetitions = competitions?.filter(c => c.status === 'completed') || [];

  const topPerformers = topUsers?.slice(0, 3) || [];
  const otherUsers = topUsers?.slice(3) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Bảng xếp hạng toàn cầu
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Theo dõi những người dẫn đầu trong cộng đồng AI VieMind và học hỏi từ các chuyên gia hàng đầu
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top 3 Podium */}
        {!usersLoading && topPerformers.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              🏆 Top 3 Contributors
            </h2>
            <div className="flex justify-center items-end space-x-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-24 h-32 bg-gradient-to-t from-slate-300 to-slate-400 rounded-t-lg flex items-end justify-center pb-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                    {(topPerformers[1]?.fullName || topPerformers[1]?.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Medal className="h-6 w-6 text-slate-400 mr-1" />
                  <span className="text-lg font-bold">#2</span>
                </div>
                <h3 className="font-semibold text-slate-800 truncate max-w-24">
                  {topPerformers[1]?.fullName || topPerformers[1]?.username}
                </h3>
                <p className="text-sm text-slate-600">
                  {topPerformers[1]?.points?.toLocaleString() || 0} điểm
                </p>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-24 h-40 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-end justify-center pb-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                    {(topPerformers[0]?.fullName || topPerformers[0]?.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Crown className="h-7 w-7 text-yellow-500 mr-1" />
                  <span className="text-xl font-bold">#1</span>
                </div>
                <h3 className="font-semibold text-slate-800 truncate max-w-24">
                  {topPerformers[0]?.fullName || topPerformers[0]?.username}
                </h3>
                <p className="text-sm text-slate-600">
                  {topPerformers[0]?.points?.toLocaleString() || 0} điểm
                </p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-end justify-center pb-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                    {(topPerformers[2]?.fullName || topPerformers[2]?.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-orange-500 mr-1" />
                  <span className="text-lg font-bold">#3</span>
                </div>
                <h3 className="font-semibold text-slate-800 truncate max-w-24">
                  {topPerformers[2]?.fullName || topPerformers[2]?.username}
                </h3>
                <p className="text-sm text-slate-600">
                  {topPerformers[2]?.points?.toLocaleString() || 0} điểm
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-primary to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Cuộc thi đang diễn ra</h3>
                  <TrendingUp className="h-6 w-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {ongoingCompetitions.length}
                </div>
                <div className="text-blue-100 text-sm">
                  Cơ hội thể hiện tài năng
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Tổng người dùng</h3>
                  <Users className="h-6 w-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {topUsers?.length || 0}+
                </div>
                <div className="text-green-100 text-sm">
                  Thành viên hoạt động
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Cuộc thi hoàn thành</h3>
                  <Trophy className="h-6 w-6 text-yellow-200" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {completedCompetitions.length}
                </div>
                <div className="text-orange-100 text-sm">
                  Thành tựu đạt được
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Điểm trung bình</h3>
                  <Target className="h-6 w-6 text-purple-200" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {topUsers?.length ? Math.round((topUsers.reduce((sum, user) => sum + (user.points || 0), 0) / topUsers.length)) : 0}
                </div>
                <div className="text-purple-100 text-sm">
                  Của tất cả thành viên
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overall">Tổng thể</TabsTrigger>
                <TabsTrigger value="monthly">Tháng này</TabsTrigger>
                <TabsTrigger value="competitions">Theo cuộc thi</TabsTrigger>
              </TabsList>

              <TabsContent value="overall" className="mt-6">
                {usersLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-slate-200 rounded" />
                            <div className="w-12 h-12 bg-slate-200 rounded-full" />
                            <div className="flex-1">
                              <div className="h-4 bg-slate-200 rounded mb-2" />
                              <div className="h-3 bg-slate-200 rounded w-2/3" />
                            </div>
                            <div className="h-6 bg-slate-200 rounded w-16" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <LeaderboardTable 
                    users={otherUsers} 
                    title="Bảng xếp hạng tổng thể"
                    showPoints={true}
                  />
                )}
              </TabsContent>

              <TabsContent value="monthly" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảng xếp hạng tháng này</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Đang cập nhật
                      </h3>
                      <p className="text-slate-600">
                        Bảng xếp hạng theo tháng sẽ được cập nhật sớm
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competitions" className="mt-6">
                <div className="space-y-6">
                  {competitionsLoading ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-slate-200 rounded mb-4" />
                          <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-4 bg-slate-200 rounded" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : ongoingCompetitions.length > 0 ? (
                    ongoingCompetitions.map((competition) => (
                      <Card key={competition.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">{competition.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className="bg-green-100 text-green-800">
                                  {competition.category}
                                </Badge>
                                <span className="text-sm text-slate-600">
                                  {competition.currentParticipants || 0} người tham gia
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <Trophy className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-600">
                              Bảng xếp hạng sẽ hiển thị khi có bài nộp
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Không có cuộc thi đang diễn ra
                          </h3>
                          <p className="text-slate-600">
                            Hãy theo dõi để cập nhật các cuộc thi mới nhất
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
