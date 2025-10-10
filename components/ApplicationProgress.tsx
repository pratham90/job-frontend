import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/Button';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, CalendarIcon, MessageSquareIcon, FileTextIcon, ExternalLinkIcon } from './ui/Icons';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'rejected' | 'offer';
  stages: ApplicationStage[];
  nextAction?: string;
  interviewDate?: string;
}

interface ApplicationStage {
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

interface ApplicationProgressProps {
  applications: Application[];
  onViewDetails: (applicationId: string) => void;
  onScheduleInterview?: (applicationId: string) => void;
}

export function ApplicationProgress({ applications, onViewDetails, onScheduleInterview }: ApplicationProgressProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'under_review': return 'bg-yellow-500';
      case 'interview_scheduled': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      case 'offer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied': return 'Application Submitted';
      case 'under_review': return 'Under Review';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'rejected': return 'Not Selected';
      case 'offer': return 'Offer Received';
      default: return 'Unknown';
    }
  };

  const getProgressPercentage = (stages: ApplicationStage[]) => {
    const completedStages = stages.filter(stage => stage.status === 'completed').length;
    return (completedStages / stages.length) * 100;
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FileTextIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium mb-2">No applications yet</h3>
        <p className="text-muted-foreground text-sm">
          Start applying to jobs to track your application progress here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
                <p className="text-muted-foreground">{application.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied on {new Date(application.appliedDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(application.status)}`} />
                {getStatusText(application.status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(getProgressPercentage(application.stages))}%</span>
              </div>
              <Progress value={getProgressPercentage(application.stages)} className="h-2" />
            </div>

            {/* Application stages */}
            <div className="space-y-2">
              {application.stages.map((stage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {stage.status === 'completed' && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                    {stage.status === 'current' && (
                      <ClockIcon className="w-5 h-5 text-yellow-500" />
                    )}
                    {stage.status === 'pending' && (
                      <div className="w-5 h-5 border-2 border-muted rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${stage.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.name}
                    </p>
                    {stage.date && (
                      <p className="text-xs text-muted-foreground">{stage.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Next action or interview info */}
            {application.status === 'interview_scheduled' && application.interviewDate && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-medium text-sm">Upcoming Interview</span>
                </div>
                <p className="text-sm text-purple-600">
                  {new Date(application.interviewDate).toLocaleDateString()} at{' '}
                  {new Date(application.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {application.nextAction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <AlertCircleIcon className="w-4 h-4" />
                  <span className="font-medium text-sm">Action Required</span>
                </div>
                <p className="text-sm text-blue-600">{application.nextAction}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                title="View Details"
                onClick={() => onViewDetails(application.id)}
                variant="outline"
                className="flex-1"
                icon={<ExternalLinkIcon className="w-4 h-4" />}
              />
              {application.status === 'under_review' && onScheduleInterview && (
                <Button 
                  title="Follow Up"
                  onClick={() => onScheduleInterview(application.id)}
                  variant="outline"
                  icon={<MessageSquareIcon className="w-4 h-4" />}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}