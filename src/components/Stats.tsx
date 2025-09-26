export default function Stats() {
  const stats = [
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Reliable performance you can count on",
    },
    {
      number: "10M+",
      label: "API Calls Daily",
      description: "Trusted by developers worldwide",
    },
    {
      number: "50ms",
      label: "Average Response",
      description: "Lightning-fast AI processing",
    },
    {
      number: "150+",
      label: "Countries Served",
      description: "Global infrastructure coverage",
    },
  ];

  return (
    <div className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl">Trusted by Developers</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers building the future with AI Layer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl text-primary">{stat.number}</div>
              <h3 className="text-xl">{stat.label}</h3>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}