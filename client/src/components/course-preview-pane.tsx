import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Star, Award, Shield, BookOpen } from "lucide-react";

interface CoursePreviewData {
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  price?: number;
  category: string;
  icon: string;
  overview?: string;
  mainImage?: string;
  logo?: string;
  curriculum?: Array<{
    sectionTitle: string;
    items: string[];
  }>;
  batches?: Array<{
    startDate: string;
    time: string;
    mode: string;
    instructor: string;
  }>;
  fees?: Array<{
    label: string;
    amount: number;
    notes: string;
  }>;
  careerOpportunities?: string[];
  toolsAndTechnologies?: string;
}

interface CoursePreviewPaneProps {
  data: CoursePreviewData;
}

export function CoursePreviewPane({ data }: CoursePreviewPaneProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      shield: Shield,
      book: BookOpen,
      award: Award,
      star: Star,
    };
    const IconComponent = iconMap[iconName] || Shield;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          {data.mainImage && (
            <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={data.mainImage} 
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="flex items-center justify-center w-full h-full text-white">
                      ${getIconComponent(data.icon)}
                    </div>
                  `;
                }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3">
            {data.logo && (
              <img 
                src={data.logo} 
                alt={`${data.title} logo`}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.title || "Course Title"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                {data.description || "Course description will appear here"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className={getLevelColor(data.level)}>
              {data.level || "Beginner"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.duration || "Duration"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {data.category || "Category"}
            </Badge>
          </div>

          {data.price && data.price > 0 && (
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{data.price.toLocaleString()}
            </div>
          )}
        </div>

        {/* Overview Section */}
        {data.overview && (
          <Card>
            <CardHeader>
              <CardTitle>What this course means to you</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {data.overview}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curriculum Section */}
        {data.curriculum && data.curriculum.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Curriculum
              </CardTitle>
              <CardDescription>
                Comprehensive curriculum designed by industry experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.curriculum.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                      {section.sectionTitle || `Section ${index + 1}`}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span>{item || `Lesson ${itemIndex + 1}`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batches Section */}
        {data.batches && data.batches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Batches
              </CardTitle>
              <CardDescription>
                Choose from our upcoming batch schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {data.batches.map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "Start Date TBD"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {batch.time || "Time TBD"}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {batch.mode || "Online"}
                        </Badge>
                      </div>
                      {batch.instructor && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Instructor: {batch.instructor}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fees Section */}
        {data.fees && data.fees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Fees</CardTitle>
              <CardDescription>
                Choose the plan that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.fees.map((fee, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:border-blue-500 transition-colors">
                    <div className="text-center space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {fee.label || `Plan ${index + 1}`}
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{fee.amount?.toLocaleString() || "0"}
                      </div>
                      {fee.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fee.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Opportunities */}
        {data.careerOpportunities && data.careerOpportunities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Career Opportunities
              </CardTitle>
              <CardDescription>
                Unlock these career paths after completing this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.careerOpportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {opportunity}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools & Technologies */}
        {data.toolsAndTechnologies && (
          <Card>
            <CardHeader>
              <CardTitle>Tools & Technologies</CardTitle>
              <CardDescription>
                Industry-standard tools you'll master in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {data.toolsAndTechnologies}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}