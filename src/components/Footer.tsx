import { Button } from "./ui/button";
import { Brain, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl">AI Layer</span>
            </div>
            <p className="text-muted-foreground">
              Empowering developers to build intelligent applications with ease.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4>Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Use Cases</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4>Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4>Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@ailayer.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground">
            © 2024 AI Layer. All rights reserved.
          </div>
          <div className="flex space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}