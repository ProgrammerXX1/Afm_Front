import { Button } from "./ui/button";
import { ArrowRight, Brain, Zap } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Brain className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Layer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Supercharge your applications with intelligent AI capabilities. 
            Build, deploy, and scale AI features seamlessly.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            View Documentation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-2">
            <Zap className="w-8 h-8 text-primary mx-auto" />
            <h3>Lightning Fast</h3>
            <p className="text-muted-foreground">
              Deploy AI models with millisecond response times
            </p>
          </div>
          <div className="text-center space-y-2">
            <Brain className="w-8 h-8 text-primary mx-auto" />
            <h3>Smart Integration</h3>
            <p className="text-muted-foreground">
              Seamlessly integrate with your existing tech stack
            </p>
          </div>
          <div className="text-center space-y-2">
            <ArrowRight className="w-8 h-8 text-primary mx-auto" />
            <h3>Scale Ready</h3>
            <p className="text-muted-foreground">
              Built for enterprise-grade performance and reliability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}