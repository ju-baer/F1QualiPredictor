import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PredictionsTab from "@/components/predictions-tab"
import DataAnalysisTab from "@/components/data-analysis-tab"
import AboutTab from "@/components/about-tab"
import F1Header from "@/components/f1-header"

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/images/f1-background.jpg')] bg-cover bg-center">
      <div className="container mx-auto p-4 md:p-8 bg-black/85 min-h-screen">
        <F1Header />

        <Tabs defaultValue="predictions" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="predictions" className="text-white">
              🏁 Predictions
            </TabsTrigger>
            <TabsTrigger value="data" className="text-white">
              📊 Data Analysis
            </TabsTrigger>
            <TabsTrigger value="about" className="text-white">
              ℹ️ About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <PredictionsTab />
          </TabsContent>

          <TabsContent value="data">
            <DataAnalysisTab />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
