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
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-800 bg-[#0f1e33] p-6 transition-colors hover:border-blue-600/50"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-2">
                <Icon className="h-12 w-12 text-blue-500" strokeWidth={2} />
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
