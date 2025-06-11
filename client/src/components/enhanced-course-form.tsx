import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { CoursePreviewPane } from "./course-preview-pane";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

// Enhanced course form schema with all sections
export const enhancedCourseSchema = z.object({
  // Basic Information
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  prerequisites: z.string().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be positive").optional(),
  category: z.string().min(1, "Category is required"),
  icon: z.string().min(1, "Icon is required"),
  
  // Enhanced sections
  overview: z.string().optional(),
  mainImage: z.string().optional(),
  logo: z.string().optional(),
  
  // Curriculum structure
  curriculum: z.array(z.object({
    sectionTitle: z.string(),
    items: z.array(z.string()),
  })).default([]),
  
  // Batches information
  batches: z.array(z.object({
    startDate: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    mode: z.string(),
    instructor: z.string(),
  })).default([]),
  
  // Fee structures
  fees: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    notes: z.string(),
  })).default([]),
  
  // Additional details
  careerOpportunities: z.array(z.string()).default([]),
  toolsAndTechnologies: z.string().optional(),
  whatYouWillLearn: z.string().optional(),
  
  isActive: z.boolean().default(true),
  syllabusUrl: z.string().optional(),
}).refine(data => {
  return true;
}, { message: "" }); // Generic message to be overridden by specific checks

export type EnhancedCourseFormData = z.infer<typeof enhancedCourseSchema>;

interface EnhancedCourseFormProps {
  initialData?: Partial<EnhancedCourseFormData>;
  onSubmit: (data: EnhancedCourseFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function EnhancedCourseForm({ initialData, onSubmit, isLoading, isEdit }: EnhancedCourseFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<EnhancedCourseFormData>({
    resolver: zodResolver(enhancedCourseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      duration: "",
      prerequisites: "",
      mode: "online",
      level: "beginner",
      price: 0,
      category: "",
      icon: "",
      overview: "",
      mainImage: "",
      logo: "",
      curriculum: [],
      batches: [],
      fees: [],
      careerOpportunities: [],
      toolsAndTechnologies: "",
      whatYouWillLearn: "",
      isActive: true,
      syllabusUrl: "",
      ...initialData,
    },
  });

  // Watch form values for live preview
  const watchedValues = form.watch();

  // Curriculum management
  const addCurriculumSection = () => {
    const current = form.getValues("curriculum");
    form.setValue("curriculum", [...current, { sectionTitle: "", items: [""] }]);
  };

  const removeCurriculumSection = (index: number) => {
    const current = form.getValues("curriculum");
    form.setValue("curriculum", current.filter((_, i) => i !== index));
  };

  const addCurriculumItem = (sectionIndex: number) => {
    const current = form.getValues("curriculum");
    current[sectionIndex].items.push("");
    form.setValue("curriculum", [...current]);
  };

  const removeCurriculumItem = (sectionIndex: number, itemIndex: number) => {
    const current = form.getValues("curriculum");
    current[sectionIndex].items = current[sectionIndex].items.filter((_, i) => i !== itemIndex);
    form.setValue("curriculum", [...current]);
  };

  // Batch management
  const addBatch = () => {
    const current = form.getValues("batches");
    form.setValue("batches", [...current, { startDate: "", startTime: "", endTime: "", mode: "online", instructor: "" }]);
  };

  const removeBatch = (index: number) => {
    const current = form.getValues("batches");
    form.setValue("batches", current.filter((_, i) => i !== index));
  };

  // Fee management
  const addFee = () => {
    const current = form.getValues("fees");
    form.setValue("fees", [...current, { label: "", amount: 0, notes: "" }]);
  };

  const removeFee = (index: number) => {
    const current = form.getValues("fees");
    form.setValue("fees", current.filter((_, i) => i !== index));
  };

  // Career opportunities management
  const addCareerOpportunity = () => {
    const current = form.getValues("careerOpportunities");
    form.setValue("careerOpportunities", [...current, ""]);
  };

  const removeCareerOpportunity = (index: number) => {
    const current = form.getValues("careerOpportunities");
    form.setValue("careerOpportunities", current.filter((_, i) => i !== index));
  };

  // Function to handle next button click
  const handleNextClick = () => {
    const tabOrder = ["basic", "overview", "curriculum", "batches", "fees"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  // Get the next tab name for the button label
  const getNextTabLabel = () => {
    const tabOrder = ["basic", "overview", "curriculum", "batches", "fees"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      return `Next: ${nextTab.charAt(0).toUpperCase() + nextTab.slice(1)}`;
    }
    return "Next";
  };

  const onSubmitHandler = (data: EnhancedCourseFormData) => {
    // Ensure optional fields are included even if empty
    const dataToSend = {
      ...data,
      prerequisites: data.prerequisites || "",
      overview: data.overview || "",
      mainImage: data.mainImage || "",
      logo: data.logo || "",
      toolsAndTechnologies: data.toolsAndTechnologies || "",
      whatYouWillLearn: data.whatYouWillLearn || "",
      // JSONB fields will be handled correctly by JSON.stringify in the backend
      curriculum: data.curriculum,
      batches: data.batches,
      fees: data.fees,
      careerOpportunities: data.careerOpportunities,
      syllabusUrl: data.syllabusUrl || "",
    };
    onSubmit(dataToSend);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        {/* Preview Toggle */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Course Details</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        <div className={`grid ${showPreview ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
          {/* Form Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="batches">Batches</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
              </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Course Information</CardTitle>
                <CardDescription>Essential details about the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="course-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Course description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 8 weeks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cybersecurity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., shield" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                      {/* Main Image Field */}
                  <FormField
                    control={form.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                            <FormLabel>Main Image</FormLabel>
                            <div className="flex flex-col space-y-2">
                              {/* Input/Button based on Source Selection */}
                              <div className="w-full">
                        <FormControl>
                                    <Input 
                                      type="file" 
                                      accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          field.onChange(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    />
                        </FormControl>
                              </div>
                            </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                      {/* Logo Field */}
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                            <FormLabel>Logo</FormLabel>
                             <div className="flex flex-col space-y-2">
                               {/* Input/Button based on Source Selection */}
                               <div className="w-full">
                        <FormControl>
                                      <Input 
                                        type="file" 
                                        accept="image/*"
                                     onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       if (file) {
                                         const reader = new FileReader();
                                         reader.onloadend = () => {
                                           field.onChange(reader.result as string);
                                         };
                                         reader.readAsDataURL(file);
                                       }
                                     }}
                                      />
                        </FormControl>
                               </div>
                             </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>Detailed overview and additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What this course means to you..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toolsAndTechnologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tools & Technologies</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Industry-standard tools and technologies used..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                    {/* New: What You'll Learn Field */}
                    <FormField
                      control={form.control}
                      name="whatYouWillLearn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What You'll Learn</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add the learning outcomes or skills students will gain…" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <div>
                  <FormLabel>Career Opportunities</FormLabel>
                  <div className="space-y-2 mt-2">
                    {form.watch("careerOpportunities").map((opportunity, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., Cybersecurity Analyst"
                          value={opportunity}
                          onChange={(e) => {
                            const current = form.getValues("careerOpportunities");
                            current[index] = e.target.value;
                            form.setValue("careerOpportunities", [...current]);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCareerOpportunity(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCareerOpportunity}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Career Opportunity
                    </Button>
                  </div>
                </div>

                {/* Syllabus Upload Field */}
                <FormField
                  control={form.control}
                  name="syllabusUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Syllabus (PDF only)</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // For now, store as a Data URL or mock a URL
                              // In a real application, you'd upload this to cloud storage (e.g., S3)
                              // and store the returned URL.
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              field.onChange(""); // Clear the field if no file selected
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>Structure your course content into sections and lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("curriculum").map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <FormLabel>Section Title</FormLabel>
                        <Input
                          placeholder="e.g., Introduction to Cybersecurity"
                          value={section.sectionTitle}
                          onChange={(e) => {
                            const current = form.getValues("curriculum");
                            current[sectionIndex].sectionTitle = e.target.value;
                            form.setValue("curriculum", [...current]);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCurriculumSection(sectionIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="ml-4">
                      <FormLabel className="text-sm">Lessons</FormLabel>
                      <div className="space-y-2 mt-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2">
                            <Input
                              placeholder="e.g., Lesson 1: Security Fundamentals"
                              value={item}
                              onChange={(e) => {
                                const current = form.getValues("curriculum");
                                current[sectionIndex].items[itemIndex] = e.target.value;
                                form.setValue("curriculum", [...current]);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCurriculumItem(sectionIndex, itemIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCurriculumItem(sectionIndex)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCurriculumSection}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Curriculum Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Batches</CardTitle>
                <CardDescription>Manage upcoming course batches and schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("batches").map((batch, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Batch {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeBatch(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel className="text-sm">Start Date</FormLabel>
                        <Input
                          type="date"
                          value={batch.startDate}
                          onChange={(e) => {
                            const current = form.getValues("batches");
                            current[index].startDate = e.target.value;
                            form.setValue("batches", [...current]);
                          }}
                        />
                      </div>
                      <div>
                            <FormLabel className="text-sm">Start Time</FormLabel>
                            <div className="react-time-picker-container">
                              <TimePicker
                                onChange={(value) => {
                            const current = form.getValues("batches");
                                  current[index].startTime = value ? String(value) : "";
                            form.setValue("batches", [...current]);
                          }}
                                value={batch.startTime || null}
                                clockIcon={null}
                                clearIcon={null}
                                disableClock={true}
                                format="h:m a"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                                className="react-time-picker"
                              />
                            </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel className="text-sm">Mode</FormLabel>
                        <Select
                          value={batch.mode}
                          onValueChange={(value) => {
                            const current = form.getValues("batches");
                            current[index].mode = value;
                            form.setValue("batches", [...current]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                          <div>
                            <FormLabel className="text-sm">End Time</FormLabel>
                            <div className="react-time-picker-container">
                              <TimePicker
                                onChange={(value) => {
                                  const current = form.getValues("batches");
                                  current[index].endTime = value ? String(value) : "";
                                  form.setValue("batches", [...current]);
                                }}
                                value={batch.endTime || null}
                                clockIcon={null}
                                clearIcon={null}
                                disableClock={true}
                                format="h:m a"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                                className="react-time-picker"
                              />
                            </div>
                          </div>
                        </div>
                        
                      <div>
                        <FormLabel className="text-sm">Instructor</FormLabel>
                        <Input
                          placeholder="e.g., John Doe"
                          value={batch.instructor}
                          onChange={(e) => {
                            const current = form.getValues("batches");
                            current[index].instructor = e.target.value;
                            form.setValue("batches", [...current]);
                          }}
                        />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBatch}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Batch
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Set up different pricing options for the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch("fees").map((fee, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Fee Option {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFee(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel className="text-sm">Label</FormLabel>
                        <Input
                          placeholder="e.g., Standard Plan"
                          value={fee.label}
                          onChange={(e) => {
                            const current = form.getValues("fees");
                            current[index].label = e.target.value;
                            form.setValue("fees", [...current]);
                          }}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-sm">Amount</FormLabel>
                        <Input
                          type="number"
                          placeholder="1999"
                          value={fee.amount}
                          onChange={(e) => {
                            const current = form.getValues("fees");
                            current[index].amount = parseInt(e.target.value) || 0;
                            form.setValue("fees", [...current]);
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel className="text-sm">Notes</FormLabel>
                      <Textarea
                        placeholder="e.g., Includes certificate and job assistance"
                        value={fee.notes}
                        onChange={(e) => {
                          const current = form.getValues("fees");
                          current[index].notes = e.target.value;
                          form.setValue("fees", [...current]);
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFee}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fee Option
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t">
              {activeTab !== "fees" && (
                <Button 
                  type="button" 
                  onClick={handleNextClick}
                  className="min-w-[140px]"
                >
                  {getNextTabLabel()}
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="min-w-[140px]"
              >
                {isLoading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border-l border-gray-200 dark:border-gray-700">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See how your course will look to students</p>
              </div>
              <CoursePreviewPane data={watchedValues} />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}