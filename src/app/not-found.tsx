import { Btn, Label } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="shell py-28">
      <Label>404 · no such record</Label>
      <h1 className="display mt-4 text-[clamp(32px,6vw,56px)]">
        The works has nothing filed here.
      </h1>
      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mid">
        Either this market was never opened, or the address in the URL is not
        one the factory deployed.
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        <Btn href="/markets">Browse the registry</Btn>
        <Btn href="/" variant="glass">
          Back to the front
        </Btn>
      </div>
    </div>
  );
}
