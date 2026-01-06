import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Habit Tracker Web</h1>
      <p className="text-xl text-gray-500 mb-8">Ready for your habits.</p>
      
      <div className="flex gap-4">
        <Button variant="primary" onPress={() => alert("Primary Clicked")}>
          Get Started
        </Button>
        <Button variant="secondary" onPress={() => alert("Secondary Clicked")}>
          Learn More
        </Button>
      </div>
    </div>
  );
}
