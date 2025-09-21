import { Bot, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <Bot className="w-6 h-6" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Calendar Agent</h1>
            <p className="text-sm text-muted-foreground">Smart document processing</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Powered by</span>
          <span className="font-semibold text-primary">Vision Her's</span>
        </div>
      </div>
    </header>
  );
};

export default Header;