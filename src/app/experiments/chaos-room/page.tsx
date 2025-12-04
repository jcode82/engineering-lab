import ChaosPanel from "@/components/experiments/ChaosPanel";
import SectionWrapper from "@/components/SectionWrapper";

export default function ChaosRoomPage() {
  return (
    <SectionWrapper id="chaos-room" noBorder>
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Chaos Room</h1>
        <p className="opacity-80 leading-relaxed mb-8">
          This live demo intentionally injects instability—500 errors, slow
          responses, and timeouts—so we can observe how the client handles
          retries, aborts long requests, and gracefully degrades when the
          system refuses to cooperate.
        </p>
        <ChaosPanel />
        <p className="mt-10 opacity-70 text-sm">
          Probabilities: 70% success, 20% 500s, 10% 3-second timeouts.
        </p>
      </div>
    </SectionWrapper>
  );
}
