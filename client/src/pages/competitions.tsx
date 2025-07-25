import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CompetitionCard } from '@/components/competition-card';
import { useLanguage } from '@/contexts/language-context';
import { Search, Filter } from 'lucide-react';
import type { Competition } from '@shared/schema';

export default function Competitions() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions'],
  });

  const categories = [
    { value: 'all', label: t('competitions.all') },
    { value: 'Computer Vision', label: t('competitions.computerVision') },
    { value: 'NLP', label: t('competitions.nlp') },
    { value: 'Tabular', label: t('competitions.tabular') },
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'ongoing', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Đã kết thúc' },
  ];

  const filteredCompetitions = competitions?.filter((competition) => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || competition.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || competition.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {t('competitions.featured')}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('competitions.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm cuộc thi..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category and Status Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Danh mục:</span>
              {categories.map((category) => (
                <Button
                  key={category.value}
                  size="sm"
                  variant={selectedCategory === category.value ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Trạng thái:</span>
              {statuses.map((status) => (
                <Button
                  key={status.value}
                  size="sm"
                  variant={selectedStatus === status.value ? "default" : "ghost"}
                  onClick={() => setSelectedStatus(status.value)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Competition Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
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
        ) : filteredCompetitions && filteredCompetitions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Không tìm thấy cuộc thi nào
            </h3>
            <p className="text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredCompetitions && filteredCompetitions.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Tải thêm cuộc thi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
