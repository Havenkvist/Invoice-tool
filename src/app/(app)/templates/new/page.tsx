import TemplateForm from "../template-form";

export default function NewTemplatePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Ny skabelon
      </h1>
      <TemplateForm />
    </div>
  );
}
