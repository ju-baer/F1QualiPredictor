import { Card } from "@/components/ui/card"

const AboutTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="f1-card">
          <h2 className="text-xl font-bold mb-4 text-white">About F1 Qualifying Predictor</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#E10600] mb-2">Overview</h3>
              <p className="text-white">
                The F1 Qualifying Predictor is a web application that predicts Formula 1 qualifying results using
                historical data and performance factors. It combines statistical analysis with domain knowledge to
                generate accurate predictions for upcoming race weekends.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#E10600] mb-2">Features</h3>
              <ul className="text-white list-disc pl-5 space-y-1">
                <li>
                  <strong>Data Collection:</strong> Uses historical F1 qualifying data
                </li>
                <li>
                  <strong>Machine Learning:</strong> Trains regression models to predict Q3 times
                </li>
                <li>
                  <strong>Performance Factors:</strong> Incorporates driver and team-specific performance multipliers
                </li>
                <li>
                  <strong>Hybrid Prediction:</strong> Combines ML predictions with performance-based adjustments
                </li>
                <li>
                  <strong>Interactive Dashboard:</strong> Visualize predictions and historical data
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#E10600] mb-2">How It Works</h3>
              <ol className="text-white list-decimal pl-5 space-y-1">
                <li>
                  <strong>Data Collection:</strong> The application uses historical qualifying data
                </li>
                <li>
                  <strong>Data Processing:</strong> Cleans and prepares the data for model training
                </li>
                <li>
                  <strong>Model Training:</strong> Trains a regression model on historical qualifying data
                </li>
                <li>
                  <strong>Performance Factors:</strong> Applies driver and team-specific adjustments
                </li>
                <li>
                  <strong>Prediction:</strong> Combines ML predictions with performance factors to generate final
                  predictions
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#E10600] mb-2">Technologies Used</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {[
                  { name: "Next.js", icon: "⚛️" },
                  { name: "TypeScript", icon: "📝" },
                  { name: "Tailwind CSS", icon: "🎨" },
                  { name: "Chart.js", icon: "📊" },
                  { name: "Shadcn UI", icon: "🧩" },
                  { name: "React", icon: "⚛️" },
                ].map((tech) => (
                  <div key={tech.name} className="bg-[#1E1E1E] p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">{tech.icon}</div>
                    <div className="text-white font-bold">{tech.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="f1-card mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Start</h3>
          <ol className="text-white list-decimal pl-5 space-y-2">
            <li>Select a circuit in the sidebar</li>
            <li>Choose your model settings</li>
            <li>Set weather conditions</li>
            <li>Click "GENERATE PREDICTIONS"</li>
          </ol>
        </Card>

        <Card className="f1-card">
          <h3 className="text-lg font-bold text-white mb-4">Future Improvements</h3>
          <ul className="text-white list-disc pl-5 space-y-2">
            <li>Add real-time weather conditions</li>
            <li>Incorporate track-specific modifiers</li>
            <li>Enable simulated qualifying with user input</li>
            <li>Add driver head-to-head comparison</li>
            <li>Implement actual circuit maps</li>
          </ul>

          <div className="bg-[#E10600] p-4 rounded-lg mt-6 text-center">
            <h4 className="text-white font-bold mb-1">Ready to Race?</h4>
            <p className="text-white text-sm">
              Head to the Predictions tab and generate your first qualifying prediction!
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AboutTab
