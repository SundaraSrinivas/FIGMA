import { LoginHeader } from "./components/LoginHeader";
import { HRModuleTile } from "./components/HRModuleTile";
import { EmployeeDatabaseTab } from "./components/EmployeeDatabaseTab";
import { EmployeeProvider } from "./components/EmployeeContext";
import { Toaster } from "./components/ui/sonner";
import { BarChart3, Users, DollarSign } from "lucide-react";

export default function App() {
  const handleModuleClick = (module) => {
    alert(`Opening ${module} module...`);
  };

  return (
    <EmployeeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Login */}
        <LoginHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl text-primary mb-4">
              Welcome to HR Unity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive human resources management platform. Access all your HR tools from one unified interface.
            </p>
          </div>

          {/* HR Module Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HRModuleTile
              title="Performance Management"
              description="Track employee performance, set goals, conduct reviews, and manage career development plans."
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              onEnter={() => handleModuleClick("Performance Management")}
            />
            
            <HRModuleTile
              title="Skills Management"
              description="Assess competencies, identify skill gaps, and create personalized learning and development pathways."
              icon={<Users className="w-8 h-8 text-primary" />}
              onEnter={() => handleModuleClick("Skills Management")}
            />
            
            <HRModuleTile
              title="Compensation Management"
              description="Manage salary structures, benefits administration, and compensation planning across your organization."
              icon={<DollarSign className="w-8 h-8 text-primary" />}
              onEnter={() => handleModuleClick("Compensation Management")}
            />
          </div>

          {/* Footer Section */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your HR administrator or 
              <a href="#" className="text-primary hover:underline ml-1">
                view documentation
              </a>
            </p>
          </div>
        </main>

        {/* Fixed Employee Database Tab */}
        <EmployeeDatabaseTab />

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </EmployeeProvider>
  );
}