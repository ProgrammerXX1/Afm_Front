import { Card } from "./ui/card";
import { MessageSquare, Image, FileText, Cpu, Shield, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Language Processing",
      description: "Advanced text analysis, sentiment detection, and conversational AI capabilities.",
    },
    {
      icon: Image,
      title: "Computer Vision",
      description: "Image recognition, object detection, and visual content analysis powered by AI.",
    },
    {
      icon: FileText,
      title: "Document Intelligence",
      description: "Extract insights from documents, automate data processing, and content generation.",
    },
    {
      icon: Cpu,
      title: "Machine Learning APIs",
      description: "Pre-trained models and custom ML pipelines for your specific use cases.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with SOC2 compliance and data privacy protection.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor performance, track usage, and optimize your AI implementations.",
    },
  ];

  return (
    <div className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl">Powerful AI Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build intelligent applications with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="bg-primary/10 p-3 rounded-lg w-fit">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3>{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}