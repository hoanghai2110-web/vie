import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CompetitionCard } from '@/components/competition-card';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Settings, 
  Trophy, 
  Medal, 
  Target, 
  Calendar,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { z } from 'zod';
import type { User as UserType, Participant, Competition } from '@shared/schema';

const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  bio: z.string().max(500, 'Mô tả không được quá 500 ký tự').optional(),
  githubUrl: z.string().url('URL GitHub không hợp lệ').optional().or(z.literal('')),
  linkedinUrl: z.string().url('URL LinkedIn không hợp lệ').optional().or(z.literal('')),
});

type ProfileUpdateRequest = z.infer<typeof profileUpdateSchema>;

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const { data: userCompetitions, isLoading: competitionsLoading } = useQuery<(Participant & { competition: Competition })[]>({
    queryKey: ['/api/users', user?.id, 'competitions'],
    enabled: !!user?.id,
  });

  const form = useForm<ProfileUpdateRequest>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      githubUrl: user?.githubUrl || '',
      linkedinUrl: user?.linkedinUrl || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      const response = await apiRequest('PATCH', `/api/users/${user?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileUpdateRequest) => {
    updateMutation.mutate(data);
  };

  const addSkill = () => {
    if (newSkill.trim() && user?.skills) {
      const updatedSkills = [...(user.skills || []), newSkill.trim()];
      // TODO: Implement skill update API
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (user?.skills) {
      const updatedSkills = user.skills.filter(skill => skill !== skillToRemove);
      // TODO: Implement skill update API
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Chưa đăng nhập
            </h3>
            <p className="text-slate-600 mb-4">
              Vui lòng đăng nhập để xem thông tin cá nhân
            </p>
            <Button>Đăng nhập</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ongoingCompetitions = userCompetitions?.filter(p => p.competition.status === 'ongoing') || [];
  const completedCompetitions = userCompetitions?.filter(p => p.competition.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || ''} alt={user.fullName || user.username} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                {(user.fullName || user.username).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    {user.fullName || user.username}
                  </h1>
                  <p className="text-slate-600 mt-1">@{user.username}</p>
                  {user.bio && (
                    <p className="text-slate-700 mt-2 max-w-2xl">{user.bio}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    <Settings className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-slate-600">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                {user.githubUrl && (
                  <a 
                    href={user.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-600 hover:text-primary"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                )}
                {user.linkedinUrl && (
                  <a 
                    href={user.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-600 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                )}
              </div>

              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="relative group">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Thêm kỹ năng"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="w-32 h-8"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button size="sm" onClick={addSkill}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-accent mr-2" />
                    <span className="text-sm">Điểm tổng</span>
                  </div>
                  <span className="font-bold text-lg">{user.points?.toLocaleString() || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">Cuộc thi tham gia</span>
                  </div>
                  <span className="font-bold">{userCompetitions?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Medal className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm">Đang tham gia</span>
                  </div>
                  <span className="font-bold">{ongoingCompetitions.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-slate-500 mr-2" />
                    <span className="text-sm">Đã hoàn thành</span>
                  </div>
                  <span className="font-bold">{completedCompetitions.length}</span>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chỉnh sửa thông tin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả bản thân</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Viết vài dòng về bản thân..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="competitions">Cuộc thi</TabsTrigger>
                <TabsTrigger value="submissions">Bài nộp</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Chưa có hoạt động nào
                      </h3>
                      <p className="text-slate-600">
                        Tham gia cuộc thi để thấy hoạt động của bạn ở đây
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {ongoingCompetitions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Cuộc thi đang tham gia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {ongoingCompetitions.slice(0, 4).map((participation) => (
                          <CompetitionCard 
                            key={participation.id} 
                            competition={participation.competition}
                            className="h-full"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="competitions" className="mt-6">
                {competitionsLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="aspect-video bg-slate-200" />
                        <CardContent className="p-6">
                          <div className="h-4 bg-slate-200 rounded mb-2" />
                          <div className="h-6 bg-slate-200 rounded mb-4" />
                          <div className="h-10 bg-slate-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : userCompetitions && userCompetitions.length > 0 ? (
                  <div className="space-y-6">
                    {ongoingCompetitions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Đang tham gia ({ongoingCompetitions.length})
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {ongoingCompetitions.map((participation) => (
                            <CompetitionCard 
                              key={participation.id} 
                              competition={participation.competition}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {completedCompetitions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Đã hoàn thành ({completedCompetitions.length})
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {completedCompetitions.map((participation) => (
                            <CompetitionCard 
                              key={participation.id} 
                              competition={participation.competition}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          Chưa tham gia cuộc thi nào
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Khám phá các cuộc thi AI thú vị và bắt đầu hành trình của bạn
                        </p>
                        <Button>Khám phá cuộc thi</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử nộp bài</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Chưa có bài nộp nào
                      </h3>
                      <p className="text-slate-600">
                        Lịch sử các bài nộp của bạn sẽ xuất hiện ở đây
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
