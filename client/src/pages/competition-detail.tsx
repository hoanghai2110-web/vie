import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { AuthService } from '@/lib/auth';
import { 
  Trophy, 
  Users, 
  Clock, 
  Calendar, 
  Download, 
  Upload, 
  FileText, 
  Target,
  Medal,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { z } from 'zod';
import type { Competition, Participant, Submission } from '@shared/schema';

const joinCompetitionSchema = z.object({
  teamName: z.string().min(1, 'Team name is required').max(100),
});

const submitFileSchema = z.object({
  file: z.any().refine((files) => files?.length == 1, "File is required."),
});

type JoinCompetitionRequest = z.infer<typeof joinCompetitionSchema>;
type SubmitFileRequest = z.infer<typeof submitFileSchema>;

export default function CompetitionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: competition, isLoading: competitionLoading } = useQuery<Competition>({
    queryKey: ['/api/competitions', id],
  });

  const { data: participants, isLoading: participantsLoading } = useQuery<(Participant & { user: any })[]>({
    queryKey: ['/api/competitions', id, 'participants'],
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<any[]>({
    queryKey: ['/api/competitions', id, 'leaderboard'],
  });

  const joinForm = useForm<JoinCompetitionRequest>({
    resolver: zodResolver(joinCompetitionSchema),
    defaultValues: {
      teamName: user?.username || '',
    },
  });

  const submitForm = useForm<SubmitFileRequest>({
    resolver: zodResolver(submitFileSchema),
  });

  const joinMutation = useMutation({
    mutationFn: async (data: JoinCompetitionRequest) => {
      const response = await apiRequest('POST', `/api/competitions/${id}/join`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tham gia thành công",
        description: "Bạn đã tham gia cuộc thi thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/competitions', id, 'participants'] });
    },
    onError: (error: any) => {
      toast({
        title: "Tham gia thất bại",
        description: error.message || "Có lỗi xảy ra khi tham gia cuộc thi",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitFileRequest) => {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      
      const response = await fetch(`/api/competitions/${id}/submit`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Nộp bài thành công",
        description: "File của bạn đã được tải lên và đang được xử lý",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/competitions', id, 'leaderboard'] });
      submitForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Nộp bài thất bại",
        description: error.message || "Có lỗi xảy ra khi nộp bài",
        variant: "destructive",
      });
    },
  });

  const onJoin = (data: JoinCompetitionRequest) => {
    joinMutation.mutate(data);
  };

  const onSubmit = (data: SubmitFileRequest) => {
    submitMutation.mutate(data);
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'computer vision':
        return 'bg-green-100 text-green-800';
      case 'nlp':
        return 'bg-blue-100 text-blue-800';
      case 'tabular':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrize = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(num) + ' VNĐ';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(num);
  };

  const getDaysLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isUserParticipating = user && participants?.some(p => p.userId === user.id);

  if (competitionLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-200 rounded w-2/3 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-96 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Cuộc thi không tồn tại
            </h3>
            <p className="text-slate-600 mb-4">
              Cuộc thi này có thể đã bị xóa hoặc không còn khả dụng.
            </p>
            <Button asChild>
              <Link href="/competitions">Về trang cuộc thi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/competitions">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Về danh sách cuộc thi
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Chia sẻ
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge className={getCategoryColor(competition.category)}>
                  {competition.category}
                </Badge>
                <div className="flex items-center text-slate-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {getDaysLeft(competition.endDate)} ngày còn lại
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                {competition.title}
              </h1>

              <p className="text-lg text-slate-600 mb-4">
                {competition.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-accent" />
                  <span className="font-semibold">
                    {formatPrize(competition.prizeAmount || '0', competition.currency || 'VND')}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {competition.currentParticipants || 0} người tham gia
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Kết thúc: {new Date(competition.endDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            {user && !isUserParticipating && competition.status === 'ongoing' && (
              <Card className="w-80">
                <CardHeader>
                  <CardTitle className="text-lg">Tham gia cuộc thi</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...joinForm}>
                    <form onSubmit={joinForm.handleSubmit(onJoin)} className="space-y-4">
                      <FormField
                        control={joinForm.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đội (tùy chọn)</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tên đội của bạn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={joinMutation.isPending}
                      >
                        {joinMutation.isPending ? 'Đang tham gia...' : 'Tham gia ngay'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="data">Dữ liệu</TabsTrigger>
                <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
                <TabsTrigger value="discussion">Thảo luận</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả cuộc thi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{competition.description}</p>
                      {competition.rules && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Quy định cuộc thi:</h4>
                          <div className="whitespace-pre-wrap text-sm text-slate-600">
                            {competition.rules}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tiêu chí đánh giá</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {competition.evaluationMetric || 'Accuracy Score'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Mô hình của bạn sẽ được đánh giá dựa trên độ chính xác dự đoán trên tập test.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tải dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {competition.datasetUrl ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-blue-500" />
                            <div>
                              <h4 className="font-medium">Dataset chính thức</h4>
                              <p className="text-sm text-slate-600">Dữ liệu huấn luyện và test</p>
                            </div>
                          </div>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                        
                        {isUserParticipating && (
                          <Card className="bg-blue-50">
                            <CardHeader>
                              <CardTitle className="text-lg">Nộp bài dự thi</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Form {...submitForm}>
                                <form onSubmit={submitForm.handleSubmit(onSubmit)} className="space-y-4">
                                  <FormField
                                    control={submitForm.control}
                                    name="file"
                                    render={({ field: { onChange, value, ...field } }) => (
                                      <FormItem>
                                        <FormLabel>Chọn file nộp bài (CSV, ZIP)</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="file"
                                            accept=".csv,.zip,.json"
                                            onChange={(e) => onChange(e.target.files)}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button 
                                    type="submit" 
                                    disabled={submitMutation.isPending}
                                    className="w-full"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {submitMutation.isPending ? 'Đang tải lên...' : 'Nộp bài'}
                                  </Button>
                                </form>
                              </Form>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-600">Dữ liệu chưa được công bố.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảng xếp hạng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leaderboardLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4 animate-pulse">
                            <div className="w-8 h-8 bg-slate-200 rounded" />
                            <div className="w-10 h-10 bg-slate-200 rounded-full" />
                            <div className="flex-1">
                              <div className="h-4 bg-slate-200 rounded mb-1" />
                              <div className="h-3 bg-slate-200 rounded w-2/3" />
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-16" />
                          </div>
                        ))}
                      </div>
                    ) : leaderboard && leaderboard.length > 0 ? (
                      <div className="space-y-4">
                        {leaderboard.map((entry, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-sm">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarImage src={entry.participant?.user?.avatar || ''} />
                              <AvatarFallback>
                                {(entry.participant?.user?.fullName || entry.participant?.user?.username || 'U').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {entry.participant?.teamName || entry.participant?.user?.fullName || entry.participant?.user?.username}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {entry.participant?.user?.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{entry.score?.toFixed(4) || '0.0000'}</div>
                              <div className="text-sm text-slate-500">điểm</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">
                        Chưa có bài nộp nào được ghi điểm.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thảo luận</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-center py-8">
                      Tính năng thảo luận sẽ được cập nhật sớm.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Competition Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê cuộc thi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ</span>
                    <span>{getDaysLeft(competition.endDate)} ngày còn lại</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Người tham gia</span>
                    <span className="font-semibold">{competition.currentParticipants || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Bài nộp</span>
                    <span className="font-semibold">{leaderboard?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Giải thưởng</span>
                    <span className="font-semibold text-accent">
                      {formatPrize(competition.prizeAmount || '0', competition.currency || 'VND')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Top người tham gia</CardTitle>
              </CardHeader>
              <CardContent>
                {participantsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-slate-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-3 bg-slate-200 rounded mb-1" />
                          <div className="h-2 bg-slate-200 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : participants && participants.length > 0 ? (
                  <div className="space-y-3">
                    {participants.slice(0, 5).map((participant, index) => (
                      <div key={participant.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.user?.avatar || ''} />
                          <AvatarFallback className="text-xs">
                            {(participant.user?.fullName || participant.user?.username || 'U').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {participant.teamName || participant.user?.fullName || participant.user?.username}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {participant.user?.email}
                          </p>
                        </div>
                        {index < 3 && (
                          <Medal className="h-4 w-4 text-accent" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">Chưa có người tham gia.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
