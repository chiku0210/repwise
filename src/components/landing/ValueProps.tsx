import { Dumbbell, TrendingUp, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Dumbbell,
    title: 'Track Workouts',
    description: 'Log every exercise, set, and rep with ease. Build your training history.',
  },
  {
    icon: TrendingUp,
    title: 'Monitor Progress',
    description: 'Visualize your gains over time. See your strength improvements.',
  },
  {
    icon: BookOpen,
    title: 'Learn & Grow',
    description: 'Access exercise guides and form tips. Train smart, not just hard.',
  },
];

export function ValueProps() {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3 md:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-800 bg-[#0f1e33] p-6 transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/20 p-3 ring-1 ring-blue-500/30">
                <Icon className="h-10 w-10 text-blue-400 md:h-12 md:w-12" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
