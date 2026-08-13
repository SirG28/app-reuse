type Props = {
  title: string;
  actionText?: string;
};

export default function SectionHeader({ title, actionText }: Props) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-reuse-text">{title}</h2>
      {actionText ? (
        <span className="text-[13px] font-semibold text-reuse-green">
          {actionText} ›
        </span>
      ) : null}
    </div>
  );
}
