import { HEART_PATH, HEART_VIEWBOX } from "@/lib/heart";

type Props = React.SVGProps<SVGSVGElement> & { title?: string };

export function Heart({ title, ...props }: Props) {
  return (
    <svg viewBox={HEART_VIEWBOX} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} {...props}>
      {title && <title>{title}</title>}
      <path d={HEART_PATH} />
    </svg>
  );
}
