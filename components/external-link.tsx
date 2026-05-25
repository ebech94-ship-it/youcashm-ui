"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({
  href,
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </Link>
  );
}