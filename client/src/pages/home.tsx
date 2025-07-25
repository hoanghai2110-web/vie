import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompetitionCard } from '@/components/competition-card';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { useLanguage } from '@/contexts/language-context';
import { Rocket, Play, Trophy, Users, TrendingUp, Brain, Shield, Rocket as RocketIcon, GraduationCap, Handshake, Smartphone } from 'lucide-react';
import type { Competition, User } from '@shared/schema';

export default function Home() {
  const { t } = useLanguage();

  const { data: featuredCompetitions, isLoading: competitionsLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions/featured'],
  });

  const { data: topUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users/leaderboard'],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 px-8 py-4"
                  asChild
                >
                  <Link href="/competitions">
                    <Rocket className="mr-2 h-5 w-5" />
                    {t('hero.startCompeting')}
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t('hero.watchDemo')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <Card className="glass-card p-6 transform rotate-3">
                  <div className="w-12 h-12 bg-accent rounded-lg mb-4 flex items-center justify-center">
                    <Trophy className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Giải thưởng</h3>
                  <p className="text-blue-100 text-sm">Tổng giải thưởng 2.5 tỷ VNĐ</p>
                </Card>

                <Card className="glass-card p-6 transform -rotate-2 mt-8">
                  <div className="w-12 h-12 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                    <Users className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Cộng đồng</h3>
                  <p className="text-blue-100 text-sm">15,000+ thành viên</p>
                </Card>

                <Card className="glass-card p-6 transform rotate-1 -mt-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg mb-4 flex items-center justify-center">
                    <TrendingUp className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Cuộc thi</h3>
                  <p className="text-blue-100 text-sm">250+ cuộc thi đã tổ chức</p>
                </Card>

                <Card className="glass-card p-6 transform -rotate-1">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    <GraduationCap className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Học tập</h3>
                  <p className="text-blue-100 text-sm">1000+ bài học miễn phí</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {t('competitions.featured')}
              </h2>
              <p className="text-slate-600">
                {t('competitions.subtitle')}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-primary text-white">
                {t('competitions.all')}
              </Button>
              <Button size="sm" variant="ghost">
                {t('competitions.computerVision')}
              </Button>
              <Button size="sm" variant="ghost">
                {t('competitions.nlp')}
              </Button>
              <Button size="sm" variant="ghost">
                {t('competitions.tabular')}
              </Button>
            </div>
          </div>

          {competitionsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCompetitions?.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/competitions">
                {t('competitions.viewAll')}
                <Rocket className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Bảng xếp hạng toàn cầu</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Theo dõi những người dẫn đầu trong cộng đồng AI VieMind và học hỏi từ các chuyên gia hàng đầu
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {usersLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
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
                <LeaderboardTable users={topUsers?.slice(0, 5) || []} />
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary to-blue-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Cuộc thi đang diễn ra</h3>
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold mb-2">23</div>
                  <div className="text-blue-100 text-sm">+5 so với tuần trước</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary to-green-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Tổng người tham gia</h3>
                    <Users className="h-6 w-6 text-green-200" />
                  </div>
                  <div className="text-3xl font-bold mb-2">15,247</div>
                  <div className="text-green-100 text-sm">Từ 45+ quốc gia</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Tổng giải thưởng</h3>
                    <Trophy className="h-6 w-6 text-yellow-200" />
                  </div>
                  <div className="text-3xl font-bold mb-2">2.5B</div>
                  <div className="text-orange-100 text-sm">VNĐ trong năm 2024</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Cách thức hoạt động</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Quy trình đơn giản để bắt đầu hành trình AI của bạn trên VieMind
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">1. Đăng ký</h3>
              <p className="text-slate-600 text-sm">
                Tạo tài khoản miễn phí với email hoặc Google
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">2. Khám phá</h3>
              <p className="text-slate-600 text-sm">
                Tìm kiếm cuộc thi phù hợp với kỹ năng của bạn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">3. Tham gia</h3>
              <p className="text-slate-600 text-sm">
                Tải dữ liệu, xây dựng mô hình và nộp bài
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">4. Chiến thắng</h3>
              <p className="text-slate-600 text-sm">
                Nhận giải thưởng và phát triển sự nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Tại sao chọn VieMind?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nền tảng được thiết kế dành riêng cho cộng đồng AI Việt Nam với các tính năng vượt trội
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Hỗ trợ tiếng Việt</h3>
                <p className="text-slate-600 text-sm">
                  Giao diện hoàn toàn tiếng Việt, dễ sử dụng cho mọi người Việt Nam
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-secondary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Bảo mật cao</h3>
                <p className="text-slate-600 text-sm">
                  Dữ liệu được mã hóa và bảo vệ với công nghệ Supabase tiên tiến
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <RocketIcon className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Hiệu suất cao</h3>
                <p className="text-slate-600 text-sm">
                  Upload và xử lý file lớn nhanh chóng với hạ tầng cloud hiện đại
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-purple-500 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Học tập miễn phí</h3>
                <p className="text-slate-600 text-sm">
                  Hàng nghìn bài học AI miễn phí từ cơ bản đến nâng cao
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="text-red-500 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Cộng đồng mạnh</h3>
                <p className="text-slate-600 text-sm">
                  Kết nối với 15,000+ chuyên gia AI từ khắp Việt Nam và thế giới
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="text-indigo-500 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Mobile-first</h3>
                <p className="text-slate-600 text-sm">
                  Giao diện tối ưu cho mobile, có thể tham gia cuộc thi mọi lúc mọi nơi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bắt đầu hành trình AI của bạn ngay hôm nay
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cộng đồng AI lớn nhất Việt Nam và phát triển sự nghiệp cùng chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-50 px-8 py-4"
              asChild
            >
              <Link href="/register">
                <RocketIcon className="mr-2 h-5 w-5" />
                Đăng ký miễn phí
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4"
            >
              <Users className="mr-2 h-5 w-5" />
              Dành cho doanh nghiệp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
