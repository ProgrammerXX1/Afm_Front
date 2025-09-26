import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Lightbulb, Users, Rocket } from "lucide-react";

export default function About() {
  return (
    <div className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl">The Future of AI Integration</h2>
            <p className="text-lg text-muted-foreground">
              AI Layer democratizes artificial intelligence by making advanced AI capabilities 
              accessible to every developer and organization. Our platform provides the tools, 
              infrastructure, and expertise needed to integrate AI seamlessly into any application.
            </p>
            <p className="text-lg text-muted-foreground">
              Built by AI experts and trusted by Fortune 500 companies, AI Layer is designed 
              to scale with your needs while maintaining the highest standards of security and performance.
            </p>
            <Button size="lg">
              Learn More About Our Mission
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Innovation First</h3>
                  <p className="text-muted-foreground">
                    Cutting-edge research translated into practical AI solutions for real-world problems.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Developer-Centric</h3>
                  <p className="text-muted-foreground">
                    Built by developers, for developers. Simple APIs, comprehensive docs, and world-class support.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>Scale Ready</h3>
                  <p className="text-muted-foreground">
                    From prototype to production, our infrastructure grows with your ambitions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}