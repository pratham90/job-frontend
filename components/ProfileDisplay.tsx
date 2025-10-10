import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/Button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MapPinIcon, MailIcon, PhoneIcon, EditIcon, BriefcaseIcon, GraduationCapIcon } from './ui/Icons';

interface ProfileDisplayProps {
  resumeData: any;
  onEdit: () => void;
}

export function ProfileDisplay({ resumeData, onEdit }: ProfileDisplayProps) {
  if (!resumeData) {
    return (
      <div className="text-center py-12">
        <BriefcaseIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium mb-2">No resume uploaded</h3>
        <p className="text-muted-foreground text-sm">
          Upload your resume to get started with personalized job recommendations
        </p>
      </div>
    );
  }

  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {personalInfo?.name?.split(' ').map((n: string) => n[0]).join('') || 'JD'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">{personalInfo?.name}</h2>
                <Button 
                  title="Edit"
                  onClick={onEdit}
                  variant="outline"
                  className="text-sm px-3 py-1 h-8"
                  icon={<EditIcon className="w-4 h-4" />}
                />
              </div>
              <p className="text-muted-foreground mb-3">{personalInfo?.title}</p>
              
              <div className="space-y-2 text-sm">
                {personalInfo?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MailIcon className="w-4 h-4" />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PhoneIcon className="w-4 h-4" />
                    {personalInfo.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {summary && (
            <div>
              <h4 className="font-medium mb-2">Professional Summary</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-border pl-4">
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-primary font-medium text-sm">{exp.company}</p>
                  <p className="text-muted-foreground text-xs mb-2">{exp.duration}</p>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCapIcon className="w-5 h-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-primary font-medium text-sm">{edu.school}</p>
                  <p className="text-muted-foreground text-xs">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}