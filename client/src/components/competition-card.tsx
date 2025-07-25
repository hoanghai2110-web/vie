import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Clock } from 'lucide-react';
import type { Competition } from '@shared/schema';
import { useLanguage } from '@/contexts/language-context';

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export function CompetitionCard({ competition, className = '' }: CompetitionCardProps) {
  const { t } = useLanguage();

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
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

  const getDaysLeft = () => {
    const now = new Date();
    const endDate = new Date(competition.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <Card className={`competition-card ${className}`}>
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {/* Competition category icon/image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="text-6xl opacity-20">
            {competition.category === 'Computer Vision' && '👁️'}
            {competition.category === 'NLP' && '💬'}
            {competition.category === 'Tabular' && '📊'}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(competition.category)}>
            {competition.category}
          </Badge>
          <div className="flex items-center text-slate-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {getDaysLeft()} {t('competitions.daysLeft')}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
          {competition.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {competition.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-accent font-bold flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            {formatPrize(competition.prizeAmount || '0', competition.currency || 'VND')}
          </div>
          <div className="text-slate-500 text-sm flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {competition.currentParticipants || 0} {t('competitions.teams')}
          </div>
        </div>

        <Button className="w-full" asChild>
          <Link href={`/competitions/${competition.id}`}>
            {t('competitions.joinNow')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
